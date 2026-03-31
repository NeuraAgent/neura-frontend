import type { ChatMessage, Citation } from './types';
import type { EnterpriseDocument } from '@/features/abac/types';

/**
 * Mock RAG Response Generator
 * Simulates AI behavior that references selected documents
 */

const mockResponses = [
  {
    template: 'Based on the selected documents, here are the key insights: {DOCS} {CONTENT}',
  },
  {
    template: 'From the documents you selected ({DOCS}), I can provide this analysis: {CONTENT}',
  },
  {
    template: 'After reviewing {DOCS}, the answer is: {CONTENT}',
  },
  {
    template: 'According to the information in {DOCS}, we can conclude: {CONTENT}',
  },
];

const responsePatterns: Record<string, string[]> = {
  marketing: [
    'The marketing strategy focuses on customer engagement and brand awareness.',
    'Our campaigns are designed to reach target demographics through multiple channels.',
    'Content marketing plays a crucial role in establishing thought leadership.',
  ],
  engineering: [
    'The technical architecture emphasizes scalability and maintainability.',
    'We follow best practices for code organization and testing.',
    'Performance optimization is a key priority in our development process.',
  ],
  sales: [
    'The sales approach emphasizes relationship building and customer value.',
    'Our pipeline management focuses on qualification and nurturing.',
    'Revenue targets are aligned with market conditions and capacity.',
  ],
  finance: [
    'Financial planning requires careful budgeting and resource allocation.',
    'Cost optimization should not compromise quality or security.',
    'Quarterly reviews help us track spending against projections.',
  ],
  legal: [
    'Compliance is critical in all operational decisions.',
    'Risk management strategies protect company interests.',
    'Regular audits ensure adherence to regulatory standards.',
  ],
  hr: [
    'Employee development is key to long-term success.',
    'Our talent acquisition strategy focuses on cultural fit.',
    'Performance management supports career growth and accountability.',
  ],
};

export async function generateMockResponse(
  userQuery: string,
  documents: EnterpriseDocument[],
  _delayMs: number = 1500
): Promise<{ content: string; citations: Citation[] }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, _delayMs));

  // Extract citations from documents
  const citations: Citation[] = documents.slice(0, 3).map(doc => ({
    documentId: doc.id,
    title: doc.title,
    preview: doc.description.substring(0, 100) + '...',
    sensitivity: doc.attributes.sensitivity,
    department: doc.attributes.department,
  }));

  // Build document reference string
  const docTitles = documents.map(d => `"${d.title}"`).join(', ');
  const docNames = documents.map(d => d.attributes.department).join(', ');

  // Select response template
  const template = mockResponses[Math.floor(Math.random() * mockResponses.length)].template;

  // Get relevant response based on document departments
  const relevantResponses = documents
    .flatMap(doc => responsePatterns[doc.attributes.department] || [])
    .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  const selectedResponse =
    relevantResponses.length > 0
      ? relevantResponses[Math.floor(Math.random() * relevantResponses.length)]
      : 'The documents provide valuable information for addressing your question.';

  // Build final response
  const content = template
    .replace('{DOCS}', docTitles)
    .replace('{CONTENT}', selectedResponse);

  return { content, citations };
}
