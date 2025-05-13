import { z } from "zod";
import { processSchema } from "../processSchema";
import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { getTypeString } from "@src/helpers/getTypeString";

/**
 * Process ZodUnion schema
 */
export function processUnionSchema(schema: z.ZodUnion<any>, meta: SchemaMeta, indent = 0): string {
  const options = schema._def.options;
  
  let output = "Union of:";
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  // Process each option
  output += "\n\n";
  options.forEach((option: z.ZodTypeAny, index: number) => {
    output += `### Option ${index + 1}: ${getTypeString(option)}\n\n`;
    output += processSchema(option, indent + 2);
    output += "\n\n";
  });
  
  return output;
}
