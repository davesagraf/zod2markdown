import { z } from "zod";
import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { processSchema } from "../processSchema";
import { getTypeString } from "@src/helpers/getTypeString";

/**
 * Process ZodTuple schema
 */
export function processTupleSchema(schema: z.ZodTuple, meta: SchemaMeta, indent = 0): string {
  const items = schema._def.items;
  
  let output = "Tuple with elements:";
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  // Process each item
  output += "\n\n";
  items.forEach((item: z.ZodTypeAny, index: number) => {
    output += `### Element ${index + 1}: ${getTypeString(item)}\n\n`;
    output += processSchema(item, indent + 2);
    output += "\n\n";
  });
  
  // Process rest (if available)
  if (schema._def.rest) {
    output += `### Rest: ${getTypeString(schema._def.rest)}\n\n`;
    output += processSchema(schema._def.rest, indent + 2);
  }
  
  return output;
}
