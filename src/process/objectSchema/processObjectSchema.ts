import { formatDefaultValue } from "@src/format/formatDefaultValue";
import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { z } from "zod";
import { extractSchemaMeta } from "@src/helpers/extractSchemaMeta";
import { getTypeString } from "@src/helpers/getTypeString";
import { unwrapSchema } from "@src/helpers/unwrapSchema";

/**
 * Process ZodObject schema to Markdown table
 */
export function processObjectSchema(schema: z.ZodObject<any>, meta: SchemaMeta, indent = 0): string {
  let output = '';
  
  // Add schema description if available
  if (meta.description) {
    output += `${meta.description}\n\n`;
  }
  
  // Create table header
  output += "| Property | Type | Required | Description | Default |\n";
  output += "|----------|------|----------|-------------|---------|\n";
  
  const shape = schema.shape;
  
  // Process each property
  for (const [key, prop] of Object.entries(shape)) {
    //@ts-ignore
    const propMeta = extractSchemaMeta(prop);
    const isOptional = prop instanceof z.ZodOptional || propMeta.optional;
    //@ts-ignore
    const typeString = getTypeString(unwrapSchema(prop));
    
    // Format description and default value
    const description = propMeta.description || '';
    const defaultValue = propMeta.default !== undefined 
      ? formatDefaultValue(propMeta.default) 
      : '';
    
    output += `| ${key} | ${typeString} | ${!isOptional ? "Yes" : "No"} | ${description} | ${defaultValue} |\n`;
  }
  
  return output;
}
