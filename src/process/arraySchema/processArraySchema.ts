import { z } from "zod";
import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { processSchema } from "../processSchema";
import { getTypeString } from "@src/helpers/getTypeString";
import { extractArrayValidations } from "@src/helpers/extractArrayValidations";

/**
 * Process ZodArray schema
 */
export function processArraySchema(schema: z.ZodArray<any>, meta: SchemaMeta, indent = 0): string {
  const itemType = schema.element;
  const itemTypeString = getTypeString(itemType);
  
  let output = `Array of ${itemTypeString}`;
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  // Add validations if available
  const validations = extractArrayValidations(schema);
  if (validations.length > 0) {
    output += "\n\n**Validations:**\n";
    validations.forEach(validation => {
      output += `- ${validation}\n`;
    });
  }
  
  // If the item type is complex, add more details
  if (
    itemType instanceof z.ZodObject || 
    itemType instanceof z.ZodUnion || 
    itemType instanceof z.ZodIntersection
  ) {
    output += "\n\n**Item Schema:**\n\n";
    output += processSchema(itemType, indent + 2);
  }
  
  return output;
}
