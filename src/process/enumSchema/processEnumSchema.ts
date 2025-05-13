import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { z  } from "zod";

/**
 * Process ZodEnum schema
 */
export function processEnumSchema(schema: z.ZodEnum<any>, meta: SchemaMeta, indent = 0): string {
  let output = "Enum with values:";
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  // List enum values
  output += "\n\n";
  schema.options.forEach((val: any) => {
    output += `- \`${val}\`\n`;
  });
  
  return output;
}
