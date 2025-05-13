import { z } from "zod";
import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { processSchema } from "../processSchema";
import { getTypeString } from "@src/helpers/getTypeString";

/**
 * Process ZodRecord schema
 */
export function processRecordSchema(schema: z.ZodRecord, meta: SchemaMeta, indent = 0): string {
  const keyType = schema._def.keyType;
  const valueType = schema._def.valueType;
  
  let output = `Record with keys of type ${getTypeString(keyType)} and values of type ${getTypeString(valueType)}`;
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  // If value type is complex, add more details
  if (
    valueType instanceof z.ZodObject || 
    valueType instanceof z.ZodUnion || 
    valueType instanceof z.ZodIntersection
  ) {
    output += "\n\n**Value Schema:**\n\n";
    output += processSchema(valueType, indent + 2);
  }
  
  return output;
}
