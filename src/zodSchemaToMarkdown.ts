/**
 * Enhanced Zod to Markdown converter
 * Converts Zod schemas to Markdown documentation
 */

import { z } from 'zod';

/**
 * Main function to convert a Zod schema to Markdown
 */
export function zodSchemaToMarkdown(
  schema: z.ZodTypeAny, 
  title: string, 
  schemaName = "Schema"
): string {
  if (!schema) return "";
  
  let output = `## ${title}\n\n`;
  output += `### ${schemaName}\n\n`;
  
  return output + processSchema(schema);
}

/**
 * Process a schema based on its type
 */
function processSchema(schema: z.ZodTypeAny, indent = 0): string {
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

/**
 * Process ZodObject schema to Markdown table
 */
function processObjectSchema(schema: z.ZodObject<any>, meta: SchemaMeta, indent = 0): string {
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

/**
 * Process ZodArray schema
 */
function processArraySchema(schema: z.ZodArray<any>, meta: SchemaMeta, indent = 0): string {
  const itemType = schema.element;
  const itemTypeString = getTypeString(itemType);
  
  let output = `Array of ${itemTypeString}`;
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  // Add validations if available
  const validations = extractArrayValidations(schema);
  if (validations.length > 0) {
    output += "\n\n**Validations:**\n";
    validations.forEach(validation => {
      output += `- ${validation}\n`;
    });
  }
  
  // If the item type is complex, add more details
  if (
    itemType instanceof z.ZodObject || 
    itemType instanceof z.ZodUnion || 
    itemType instanceof z.ZodIntersection
  ) {
    output += "\n\n**Item Schema:**\n\n";
    output += processSchema(itemType, indent + 2);
  }
  
  return output;
}

/**
 * Process ZodEnum schema
 */
function processEnumSchema(schema: z.ZodEnum<any>, meta: SchemaMeta, indent = 0): string {
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

/**
 * Process ZodUnion schema
 */
function processUnionSchema(schema: z.ZodUnion<any>, meta: SchemaMeta, indent = 0): string {
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

/**
 * Process ZodIntersection schema
 */
function processIntersectionSchema(schema: z.ZodIntersection<any, any>, meta: SchemaMeta, indent = 0): string {
  const left = schema._def.left;
  const right = schema._def.right;
  
  let output = "Intersection of:";
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  // Process left and right parts
  output += "\n\n### First part:\n\n";
  output += processSchema(left, indent + 2);
  output += "\n\n### Second part:\n\n";
  output += processSchema(right, indent + 2);
  
  return output;
}

/**
 * Process ZodRecord schema
 */
function processRecordSchema(schema: z.ZodRecord, meta: SchemaMeta, indent = 0): string {
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

/**
 * Process ZodTuple schema
 */
function processTupleSchema(schema: z.ZodTuple, meta: SchemaMeta, indent = 0): string {
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

/**
 * Process ZodLiteral schema
 */
function processLiteralSchema(schema: z.ZodLiteral<any>, meta: SchemaMeta, indent = 0): string {
  const value = schema._def.value;
  
  let output = `Literal: \`${formatDefaultValue(value)}\``;
  
  // Add description if available
  if (meta.description) {
    output += `\n\n${meta.description}`;
  }
  
  return output;
}

/**
 * Extract metadata from a schema
 */
interface SchemaMeta {
  description?: string;
  default?: any;
  optional?: boolean;
  nullable?: boolean;
}

function extractSchemaMeta(schema: z.ZodTypeAny): SchemaMeta {
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

/**
 * Unwrap schema from ZodOptional, ZodNullable, ZodDefault, etc.
 */
function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
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

/**
 * Extract array validations
 */
function extractArrayValidations(schema: z.ZodArray<any>): string[] {
  const validations: string[] = [];
  
  if (schema._def.minLength) {
    validations.push(`Minimum length: ${schema._def.minLength.value}`);
  }
  if (schema._def.maxLength) {
    validations.push(`Maximum length: ${schema._def.maxLength.value}`);
  }
  
  return validations;
}

/**
 * Extract string validations
 */
function extractStringValidations(schema: z.ZodString): string[] {
  const validations: string[] = [];
  
  schema._def.checks.forEach((check: any) => {
    switch (check.kind) {
      case 'min':
        validations.push(`Minimum length: ${check.value}`);
        break;
      case 'max':
        validations.push(`Maximum length: ${check.value}`);
        break;
      case 'length':
        validations.push(`Exact length: ${check.value}`);
        break;
      case 'email':
        validations.push('Must be a valid email');
        break;
      case 'url':
        validations.push('Must be a valid URL');
        break;
      case 'uuid':
        validations.push('Must be a valid UUID');
        break;
      case 'regex':
        validations.push(`Must match regex: ${check.regex}`);
        break;
      case 'startsWith':
        validations.push(`Must start with: "${check.value}"`);
        break;
      case 'endsWith':
        validations.push(`Must end with: "${check.value}"`);
        break;
    }
  });
  
  return validations;
}

/**
 * Extract number validations
 */
function extractNumberValidations(schema: z.ZodNumber): string[] {
  const validations: string[] = [];
  
  schema._def.checks.forEach((check: any) => {
    switch (check.kind) {
      case 'min':
        validations.push(`Minimum${check.inclusive ? ' (inclusive)' : ''}: ${check.value}`);
        break;
      case 'max':
        validations.push(`Maximum${check.inclusive ? ' (inclusive)' : ''}: ${check.value}`);
        break;
      case 'int':
        validations.push('Must be an integer');
        break;
      case 'multipleOf':
        validations.push(`Must be a multiple of ${check.value}`);
        break;
    }
  });
  
  return validations;
}

/**
 * Get type string representation
 */
function getTypeString(schema: z.ZodTypeAny): string {
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

/**
 * Format default value for display
 */
function formatDefaultValue(value: any): string {
  if (value === undefined) return '';
  if (value === null) return 'null';
  
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '{...}';
    }
  }
  if (typeof value === 'function') {
    return 'Function';
  }
  
  return String(value);
}
