import { z } from "zod";
import { processObjectSchema } from "./objectSchema/processObjectSchema";
import { processArraySchema } from "./arraySchema/processArraySchema";
import { processEnumSchema } from "./enumSchema/processEnumSchema";
import { processUnionSchema } from "./unionSchema/processUnionSchema";
import { processLiteralSchema } from "./literalSchema/processLiteralSchema";
import { processRecordSchema } from "./recordSchema/processRecordSchema";
import { processTupleSchema } from "./tupleSchema/processTupleSchema";
import { processIntersectionSchema } from "./intersectionSchema/processIntersectionSchema";
import { unwrapSchema } from "@src/helpers/unwrapSchema";
import { extractSchemaMeta } from "@src/helpers/extractSchemaMeta";
import { getTypeString } from "@src/helpers/getTypeString";

/**
 * Process a schema based on its type
 */
export function processSchema(schema: z.ZodTypeAny, indent = 0): string {
  // Handle special wrapper types first (ZodOptional, ZodNullable, etc.)
  schema = unwrapSchema(schema);
  
  // Get schema metadata
  const meta = extractSchemaMeta(schema);
  
  // Process based on schema type
  if (schema instanceof z.ZodObject) {
    return processObjectSchema(schema, meta, indent);
  } else if (schema instanceof z.ZodArray) {
    return processArraySchema(schema, meta, indent);
  } else if (schema instanceof z.ZodEnum) {
    return processEnumSchema(schema, meta, indent);
  } else if (schema instanceof z.ZodUnion) {
    return processUnionSchema(schema, meta, indent);
  } else if (schema instanceof z.ZodIntersection) {
    return processIntersectionSchema(schema, meta, indent);
  } else if (schema instanceof z.ZodRecord) {
    return processRecordSchema(schema, meta, indent);
  } else if (schema instanceof z.ZodTuple) {
    return processTupleSchema(schema, meta, indent);
  } else if (schema instanceof z.ZodLiteral) {
    return processLiteralSchema(schema, meta, indent);
  } else {
    // For primitive types
    return `${getTypeString(schema)}${meta.description ? ` - ${meta.description}` : ''}`;
  }
}
