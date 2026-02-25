#!/bin/bash

# Generate Frontend JWT Token (No Expiration)
# This token is used for authenticating frontend service with API Gateway

# Frontend JWT Secret - must match API Gateway FRONTEND_JWT_SECRET
FRONTEND_JWT_SECRET="fe8d9a7b6c5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a"

# JWT Header
HEADER='{"alg":"HS256","typ":"JWT"}'

# JWT Payload (no exp field = no expiration)
PAYLOAD='{"iss":"frontend-service","aud":"api-gateway","iat":'$(date +%s)'}'

# Base64 URL encode function
base64_url_encode() {
    openssl base64 -e -A | tr '+/' '-_' | tr -d '='
}

# Encode header and payload
HEADER_B64=$(echo -n "$HEADER" | base64_url_encode)
PAYLOAD_B64=$(echo -n "$PAYLOAD" | base64_url_encode)

# Create signature
SIGNATURE=$(echo -n "${HEADER_B64}.${PAYLOAD_B64}" | openssl dgst -sha256 -hmac "$FRONTEND_JWT_SECRET" -binary | base64_url_encode)

# Combine to create JWT
JWT="${HEADER_B64}.${PAYLOAD_B64}.${SIGNATURE}"

# Output the token
echo "Generated Frontend JWT Token (No Expiration):"
echo ""
echo "$JWT"
echo ""
echo "Add this to your .env file:"
echo "VITE_FRONTEND_JWT_TOKEN=$JWT"
