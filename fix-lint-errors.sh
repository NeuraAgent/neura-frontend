#!/bin/bash

# Fix all remaining lint errors

# 1. Fix SourcesManager.tsx - remove unused error variable
sed -i '' 's/} catch (error) {/} catch {/' src/components/SourcesManager.tsx

# 2. Fix textareaUtils.ts - change @ts-ignore to @ts-expect-error
sed -i '' 's/@ts-ignore/@ts-expect-error/' src/components/dashboard/utils/textareaUtils.ts

# 3. Fix useMessageSender.ts - remove unused catch variable
sed -i '' 's/} catch (e) {}/} catch {\n        \/\/ Ignore errors\n      }/' src/components/dashboard/hooks/useMessageSender.ts

# 4. Fix AccessLogs.tsx - remove unused imports
sed -i '' '/import type { AccessLog } from/d' src/features/abac/components/AccessLogs.tsx
sed -i '' 's/const { accessLogs, currentUser } = useABAC();/const { accessLogs } = useABAC();/' src/features/abac/components/AccessLogs.tsx

# 5. Fix AccessTransparency.tsx - prefix unused param with underscore
sed -i '' 's/documentTitle = /documentTitle: _documentTitle = /' src/features/abac/components/AccessTransparency.tsx

# 6. Fix engine.ts - remove unused import
sed -i '' 's/hasSufficientClearance,//' src/features/abac/engine.ts

# 7. Fix chatService.ts - remove unused imports and variables
sed -i '' '/import type { ChatMessage/d' src/features/chat/chatService.ts
sed -i '' 's/const docNames = /\/\/ const docNames = /' src/features/chat/chatService.ts

# 8. Fix CitationList.tsx - escape quotes
sed -i '' 's/Nguồn "{citation.source_name}"/Nguồn \&ldquo;{citation.source_name}\&rdquo;/' src/features/chat/components/CitationList.tsx

# 9. Fix DocumentCard.tsx - prefix unused params
sed -i '' 's/User,//' src/features/documents/components/DocumentCard.tsx
sed -i '' 's/const getFileIcon = (fileType: string)/const getFileIcon = (_fileType: string)/' src/features/documents/components/DocumentCard.tsx

# 10. Fix DocumentViewer.tsx - remove unused import
sed -i '' 's/User,//' src/features/documents/components/DocumentViewer.tsx

# 11. Fix DocumentsList.tsx - remove unused imports and variables
sed -i '' 's/Filter,//' src/features/documents/components/DocumentsList.tsx
sed -i '' '/const selectionCount = /d' src/features/documents/components/DocumentsList.tsx

# 12. Fix EnterpriseHeader.tsx - remove unused import
sed -i '' 's/CLEARANCE_LEVELS,//' src/features/enterprise/components/EnterpriseHeader.tsx

# 13. Fix AccessControlPage.tsx - remove unused imports and variables
sed -i '' 's/FileText,//' src/pages/enterprise/AccessControlPage.tsx
sed -i '' 's/const { currentUser, accessLogs, logAccess }/const { currentUser, logAccess }/' src/pages/enterprise/AccessControlPage.tsx
sed -i '' 's/const formatTime = /\/\/ const formatTime = /' src/pages/enterprise/AccessControlPage.tsx

# 14. Fix EnterpriseDashboard.tsx - remove unused imports
sed -i '' 's/Clock,//' src/pages/enterprise/EnterpriseDashboard.tsx
sed -i '' '/import Sensitivity from/d' src/pages/enterprise/EnterpriseDashboard.tsx

# 15. Fix api.ts - remove unused export
sed -i '' 's/AccessDecision,//' src/types/api.ts

echo "All lint errors fixed!"
