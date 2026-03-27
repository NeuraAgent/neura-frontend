#!/bin/bash

echo "🔍 Verifying Frontend Configuration for Cookie Authentication"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Check VITE_API_URL
echo "1. Checking VITE_API_URL..."
VITE_API_URL=$(grep "^VITE_API_URL=" .env | cut -d'=' -f2)
if [ -z "$VITE_API_URL" ]; then
    echo "   ✅ VITE_API_URL is empty (using relative URLs)"
else
    echo "   ❌ VITE_API_URL is set to: $VITE_API_URL"
    echo "   ⚠️  Should be empty for proxy to work!"
    echo "   Fix: Edit .env and set VITE_API_URL="
fi
echo ""

# Check vite.config.ts
echo "2. Checking vite.config.ts..."
if [ ! -f "vite.config.ts" ]; then
    echo "   ❌ vite.config.ts not found!"
    exit 1
fi

if grep -q "proxy:" vite.config.ts; then
    echo "   ✅ Proxy configuration found"
    
    # Check if /api proxy exists
    if grep -A 5 "'/api'" vite.config.ts | grep -q "target:"; then
        TARGET=$(grep -A 5 "'/api'" vite.config.ts | grep "target:" | sed "s/.*target: *'\([^']*\)'.*/\1/")
        echo "   ✅ /api proxy target: $TARGET"
    else
        echo "   ❌ /api proxy target not found"
    fi
else
    echo "   ❌ No proxy configuration found!"
    echo "   ⚠️  Proxy is required for cookies to work!"
fi
echo ""

# Check if dev server is running
echo "3. Checking if dev server is running..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "   ✅ Dev server is running on port 3000"
    echo "   ⚠️  If you just changed .env or vite.config.ts, restart the server!"
else
    echo "   ❌ Dev server is NOT running"
    echo "   Run: npm run dev"
fi
echo ""

# Check API Gateway
echo "4. Checking API Gateway..."
if curl -s http://100.68.50.41:9999/health >/dev/null 2>&1; then
    echo "   ✅ API Gateway is reachable at http://100.68.50.41:9999"
else
    echo "   ❌ API Gateway is NOT reachable"
    echo "   Check: docker-compose ps api-gateway"
fi
echo ""

# Summary
echo "📋 Summary:"
echo ""
if [ -z "$VITE_API_URL" ] && grep -q "proxy:" vite.config.ts; then
    echo "✅ Configuration looks good!"
    echo ""
    echo "Next steps:"
    echo "1. Restart dev server if you made changes: npm run dev"
    echo "2. Access frontend at: http://localhost:3000 or http://192.168.2.31:3000"
    echo "3. Login and check cookies in DevTools → Application → Cookies"
    echo "4. Verify cookies are set for the correct domain"
else
    echo "❌ Configuration needs fixes!"
    echo ""
    echo "Required fixes:"
    if [ ! -z "$VITE_API_URL" ]; then
        echo "- Set VITE_API_URL= (empty) in .env file"
    fi
    if ! grep -q "proxy:" vite.config.ts; then
        echo "- Add proxy configuration to vite.config.ts"
    fi
fi
echo ""
