import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { z } from "zod";

export function extractSchemaMeta(schema: z.ZodTypeAny): SchemaMeta {
  const meta: SchemaMeta = {};
  
  // Get description
  if (schema.description) {
    meta.description = schema.description;
  }
  
  // Check if optional
  try {
    meta.optional = schema.isOptional();
  } catch {
    meta.optional = false;
  }
  
  // Check if nullable
  try {
    meta.nullable = schema.isNullable();
  } catch {
    meta.nullable = false;
  }
  
  // Get default value
  if (schema instanceof z.ZodDefault) {
    meta.default = schema._def.defaultValue();
  }
  
  return meta;
}
