import { z } from "zod";

/**
 * Unwrap schema from ZodOptional, ZodNullable, ZodDefault, etc.
 */
export function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodOptional
    || schema instanceof z.ZodNullable
    || schema instanceof z.ZodDefault
    || schema instanceof z.ZodReadonly 
    || schema instanceof z.ZodCatch) {
    return unwrapSchema(schema._def.innerType);
  }
  if (schema instanceof z.ZodEffects) {
    return unwrapSchema(schema._def.schema);
  }
  if (schema instanceof z.ZodBranded) {
    return unwrapSchema(schema._def.type);
  }
  if (schema instanceof z.ZodLazy) {
    return unwrapSchema(schema._def.getter());
  }
  
  return schema;
}
