import { z } from "zod";

/**
 * Extract array validations
 */
export function extractArrayValidations(schema: z.ZodArray<any>): string[] {
  const validations: string[] = [];
  
  if (schema._def.minLength) {
    validations.push(`Minimum length: ${schema._def.minLength.value}`);
  }
  if (schema._def.maxLength) {
    validations.push(`Maximum length: ${schema._def.maxLength.value}`);
  }
  
  return validations;
}
