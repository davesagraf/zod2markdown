import { z } from "zod";
import { extractStringValidations } from "./extractStringValidations";
import { extractNumberValidations } from "./extractNumberValidations";
import { formatDefaultValue } from "@src/format/formatDefaultValue";

/**
 * Get type string representation
 */
export function getTypeString(schema: z.ZodTypeAny): string {
  if (!schema) return "unknown";
  
  // Handle special wrapper types
  if (schema instanceof z.ZodOptional) {
    return `${getTypeString(schema._def.innerType)}?`;
  }
  if (schema instanceof z.ZodNullable) {
    return `${getTypeString(schema._def.innerType)} | null`;
  }
  if (schema instanceof z.ZodDefault) {
    return getTypeString(schema._def.innerType);
  }
  
  // Handle regular types
  if (schema instanceof z.ZodString) {
    // Add validations as comments if they exist
    const validations = extractStringValidations(schema);
    return validations.length > 0 
      ? `string (${validations.join(', ')})`
      : 'string';
  }
  if (schema instanceof z.ZodNumber) {
    // Add validations as comments if they exist
    const validations = extractNumberValidations(schema);
    return validations.length > 0 
      ? `number (${validations.join(', ')})`
      : 'number';
  }
  if (schema instanceof z.ZodBoolean) return 'boolean';
  if (schema instanceof z.ZodDate) return 'date';
  if (schema instanceof z.ZodNull) return 'null';
  if (schema instanceof z.ZodUndefined) return 'undefined';
  if (schema instanceof z.ZodAny) return 'any';
  if (schema instanceof z.ZodUnknown) return 'unknown';
  if (schema instanceof z.ZodNever) return 'never';
  if (schema instanceof z.ZodVoid) return 'void';
  
  // Complex types
  if (schema instanceof z.ZodArray) {
    return `${getTypeString(schema.element)}[]`;
  }
  if (schema instanceof z.ZodObject) {
    return 'object';
  }
  if (schema instanceof z.ZodEnum) {
    return `enum (${schema.options.join(' , ')})`;
  }
  if (schema instanceof z.ZodUnion) {
    return schema._def.options.map(getTypeString).join(' | ');
  }
  if (schema instanceof z.ZodIntersection) {
    return `${getTypeString(schema._def.left)} & ${getTypeString(schema._def.right)}`;
  }
  if (schema instanceof z.ZodRecord) {
    return `Record<${getTypeString(schema._def.keyType)}, ${getTypeString(schema._def.valueType)}>`;
  }
  if (schema instanceof z.ZodTuple) {
    return `[${schema._def.items.map(getTypeString).join(', ')}${schema._def.rest ? `, ...${getTypeString(schema._def.rest)}[]` : ''}]`;
  }
  if (schema instanceof z.ZodLiteral) {
    return `literal (${formatDefaultValue(schema._def.value)})`;
  }
  if (schema instanceof z.ZodFunction) {
    return 'function';
  }
  if (schema instanceof z.ZodPromise) {
    return `Promise<${getTypeString(schema._def.type)}>`;
  }
  if (schema instanceof z.ZodBigInt) {
    return 'bigint';
  }
  
  // Fallback to typeName
  const typeName = schema._def.typeName;
  return typeName ? typeName.replace('Zod', '').toLowerCase() : 'unknown';
}
