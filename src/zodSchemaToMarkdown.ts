/**
 * Enhanced Zod to Markdown converter
 * Converts Zod schemas to Markdown documentation
 */

import { z } from 'zod';
import { processSchema } from './process/processSchema';

/**
 * Main function to convert a Zod schema to Markdown
 */
export function zodSchemaToMarkdown(
  schema: z.ZodTypeAny, 
  title: string, 
  schemaName = "Schema"
): string {
  if (!schema) return "";
  
  let output = `## ${title}\n\n`;
  output += `### ${schemaName}\n\n`;
  
  return output + processSchema(schema);
}
