# Enterprise AI Knowledge System — Backend Contract

## Overview
Backend specification for the enterprise AI knowledge system with ABAC (Attribute-Based Access Control) and RAG (Retrieval-Augmented Generation).

## API Endpoints

### 1. Authentication
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/user (get current user)
```

### 2. Documents

#### List Documents (with ABAC filtering)
```
GET /api/documents?department=engineering&sensitivity=internal&region=JP

Response:
[
  {
    "id": "doc-001",
    "title": "Engineering Guidelines",
    "description": "...",
    "fileType": "pdf",
    "fileSize": 2048000,
    "attributes": {
      "department": "engineering",
      "sensitivity": "internal",
      "region": "JP",
      "tags": ["best-practices", "guidelines"],
      "project": "core-platform"
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-03-30T00:00:00Z",
    "version": 1,
    "isArchived": false
  }
]
```

#### Get Document by ID
```
GET /api/documents/:documentId

Response: Single document object (only if user has access)
```

#### Upload Document
```
POST /api/documents
Content-Type: multipart/form-data

Request:
- file: File
- title: string
- description: string
- department: Department
- sensitivity: Sensitivity
- region: Region
- tags?: string[]
- project?: string

Response: Document object
```

#### Delete Document
```
DELETE /api/documents/:documentId

Response: { success: true }
```

### 3. Chat & RAG

#### Generate Response (RAG)
```
POST /api/chat/generate

Request:
{
  "query": "What are the engineering guidelines?",
  "documentIds": ["doc-001", "doc-002"],
  "conversationId": "conv-123" (optional),
  "userId": "user-456"
}

Response:
{
  "conversationId": "conv-123",
  "response": "Based on the engineering guidelines...",
  "citations": [
    {
      "documentId": "doc-001",
      "title": "Engineering Guidelines",
      "preview": "This document outlines...",
      "relevanceScore": 0.95,
      "pageNumber": 1
    }
  ],
  "generationTime": 1250,
  "tokensUsed": 342,
  "model": "gpt-4-turbo"
}
```

#### Chat History
```
GET /api/chat/conversations/:conversationId

Response:
{
  "id": "conv-123",
  "title": "Engineering Questions",
  "messages": [
    {
      "id": "msg-001",
      "role": "user",
      "content": "What are the guidelines?",
      "timestamp": "2025-03-30T00:00:00Z"
    },
    {
      "id": "msg-002",
      "role": "assistant",
      "content": "Based on...",
      "citations": [...],
      "timestamp": "2025-03-30T00:00:01Z"
    }
  ],
  "documentIds": ["doc-001", "doc-002"],
  "createdAt": "2025-03-30T00:00:00Z"
}
```

### 4. ABAC & Access Control

#### Check Access
```
POST /api/abac/check-access

Request:
{
  "documentId": "doc-001",
  "action": "view" | "download" | "edit" | "delete" | "share"
}

Response:
{
  "allowed": true,
  "reason": "User belongs to the same department as the document.",
  "reasons": [
    "Clearance level sufficient",
    "Department match verified",
    "Regional access allowed"
  ],
  "matchedRule": "department-access",
  "evaluatedAt": "2025-03-30T00:00:00Z"
}
```

#### Access Logs
```
GET /api/abac/logs?userId=user-456&documentId=doc-001&action=view&limit=50

Response:
[
  {
    "id": "log-001",
    "userId": "user-456",
    "documentId": "doc-001",
    "action": "view",
    "decision": {
      "allowed": true,
      "reason": "..."
    },
    "timestamp": "2025-03-30T00:00:00Z",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
]
```

### 5. Users & Attributes

#### Get User
```
GET /api/users/:userId

Response:
{
  "id": "user-456",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "avatar": "https://...",
  "attributes": {
    "department": "engineering",
    "role": "manager",
    "clearance": "confidential",
    "region": "JP",
    "managedDepartments": ["engineering", "devops"],
    "allowedProjects": ["core-platform", "mobile-app"]
  },
  "isActive": true,
  "lastLoginAt": "2025-03-29T14:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update User Attributes
```
PATCH /api/users/:userId/attributes

Request:
{
  "department": "engineering",
  "role": "manager",
  "clearance": "confidential",
  "region": "JP",
  "managedDepartments": ["engineering"],
  "allowedProjects": ["core-platform"]
}

Response: Updated user object
```

## Database Schema

### PostgreSQL + pgvector

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  avatar_url TEXT,
  
  -- ABAC Attributes
  department VARCHAR(50) NOT NULL,
  role VARCHAR(50) NOT NULL,
  clearance VARCHAR(50) NOT NULL,
  region VARCHAR(50) NOT NULL,
  managed_departments TEXT[] DEFAULT ARRAY[]::TEXT[],
  allowed_projects TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_users_email (email),
  INDEX idx_users_department (department),
  INDEX idx_users_region (region)
);

-- Documents Table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  file_type VARCHAR(20),
  file_size BIGINT,
  file_path TEXT,
  
  -- ABAC Attributes
  department VARCHAR(50) NOT NULL,
  sensitivity VARCHAR(50) NOT NULL,
  region VARCHAR(50) NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  project VARCHAR(100),
  created_by UUID REFERENCES users(id),
  
  -- Metadata
  version INTEGER DEFAULT 1,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_documents_department (department),
  INDEX idx_documents_sensitivity (sensitivity),
  INDEX idx_documents_region (region),
  INDEX idx_documents_project (project),
  INDEX idx_documents_archived (is_archived),
  FULL TEXT INDEX idx_documents_content (content, title, description)
);

-- Document Embeddings (pgvector)
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER,
  content TEXT,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_embeddings_document (document_id),
  INDEX idx_embeddings_similarity ON embedding USING ivfflat (embedding vector_cosine_ops)
);

-- Access Logs Table
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  document_id UUID NOT NULL REFERENCES documents(id),
  action VARCHAR(50) NOT NULL,
  allowed BOOLEAN NOT NULL,
  reason TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_logs_user (user_id),
  INDEX idx_logs_document (document_id),
  INDEX idx_logs_action (action),
  INDEX idx_logs_allowed (allowed),
  INDEX idx_logs_created (created_at)
);

-- Chat Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255),
  document_ids TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_conversations_user (user_id),
  INDEX idx_conversations_created (created_at)
);

-- Chat Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  citations JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_messages_conversation (conversation_id),
  INDEX idx_messages_created (created_at)
);
```

## ABAC Enforcement Strategy

### At Query Layer (Recommended)
```sql
-- Filter documents accessible to user
SELECT d.* FROM documents d
WHERE d.id IN (
  SELECT document_id FROM (
    -- Check clearance
    SELECT d.id as document_id
    FROM documents d, users u
    WHERE u.id = $1
    AND (
      -- Clearance check
      (u.clearance >= d.sensitivity) AND
      -- Department OR managed department
      (u.department = d.department OR u.managed_departments @> ARRAY[d.department]::text[]) AND
      -- Region check
      (d.region = 'GLOBAL' OR u.region = d.region) AND
      -- Project check
      (d.project IS NULL OR u.allowed_projects @> ARRAY[d.project]::text[])
    )
  ) AS accessible
);
```

### At Service Layer
Evaluate access before returning documents:
1. Fetch document from DB
2. Fetch user from DB
3. Run ABAC engine (TypeScript/Node.js)
4. Return only if allowed

### Multi-Document Retrieval
For RAG queries with multiple documents:
1. Accept `documentIds: string[]` from frontend
2. Filter against user's accessible documents
3. Only use intersection for embedding search
4. Return only documents user can access

## Embedding Strategy

### pgvector Integration
```python
from pgvector.psycopg import register_vector
import numpy as np

# Register pgvector support
register_vector(connection)

# Store embedding
embedding = model.encode(text)  # numpy array
cursor.execute(
  "INSERT INTO document_embeddings (document_id, chunk_index, content, embedding) VALUES (%s, %s, %s, %s)",
  (doc_id, chunk_idx, content, embedding)
)

# Semantic search (filtered by document_id)
query_embedding = model.encode(query)
cursor.execute("""
  SELECT document_id, content, (1 - (embedding <=> %s)) as similarity
  FROM document_embeddings
  WHERE document_id = ANY(%s)  -- Filter by allowed documents
  ORDER BY embedding <=> %s
  LIMIT 10
""", (query_embedding, accessible_doc_ids, query_embedding))
```

## Authentication & Authorization

### Session Management
- Use HTTP-only cookies
- Store session in Redis or database
- Clear on logout

### Token Strategy (JWT Optional)
```
Authorization: Bearer {token}

Token payload:
{
  "sub": "user-id",
  "department": "engineering",
  "role": "manager",
  "clearance": "confidential",
  "region": "JP",
  "exp": 1234567890,
  "iat": 1234567800
}
```

## Error Handling

### 403 Forbidden (Access Denied)
```json
{
  "error": "access_denied",
  "message": "User does not have access to this document.",
  "reason": "Insufficient clearance level. User has 'internal' clearance, but document requires 'confidential'.",
  "code": "CLEARANCE_INSUFFICIENT"
}
```

### 404 Not Found (Document Not Accessible)
```json
{
  "error": "not_found",
  "message": "Document not found or not accessible.",
  "code": "DOCUMENT_NOT_FOUND"
}
```

## Performance Optimization

1. **Index Strategy**: Always index ABAC attributes
2. **Caching**: Cache user ABAC attributes for 5 minutes
3. **Batch Operations**: Support batch access checks
4. **Query Optimization**: Use composite indexes for common filters
5. **Pagination**: Implement cursor-based pagination for large result sets
6. **Vector Search**: Use IVFFlat indexing for embeddings, tune `lists` parameter

## Security Best Practices

1. **No SQL Injection**: Always use parameterized queries
2. **Audit Logs**: Log all access attempts (allowed and denied)
3. **Rate Limiting**: Implement per-user rate limits on API
4. **Input Validation**: Validate all ABAC attributes
5. **Encryption**: Encrypt sensitive document content at rest
6. **TLS**: Enforce HTTPS for all API traffic
7. **CORS**: Configure proper CORS policies
8. **Secrets**: Never store credentials in code

## Future Enhancements

1. Row-level security (RLS) policies in PostgreSQL
2. Document versioning with audit trail
3. Granular permissions (view, edit, delete, share)
4. Time-based access (valid until date)
5. Conditional access (require MFA for sensitive docs)
6. Data classification (PII, proprietary, etc.)
7. Advanced audit reporting and compliance
