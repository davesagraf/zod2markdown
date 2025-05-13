import { formatDefaultValue } from "@src/format/formatDefaultValue";
import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { z } from "zod";

/**
 * Process ZodLiteral schema
 */
export function processLiteralSchema(schema: z.ZodLiteral<any>, meta: SchemaMeta, indent = 0): string {
  const value = schema._def.value;
  
  let output = `Literal: \`${formatDefaultValue(value)}\``;
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  return output;
}
