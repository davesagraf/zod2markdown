import { z } from "zod";

/**
 * Extract string validations
 */
export function extractStringValidations(schema: z.ZodString): string[] {
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
