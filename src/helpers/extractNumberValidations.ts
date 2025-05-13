import { z } from "zod";

/**
 * Extract number validations
 */
export function extractNumberValidations(schema: z.ZodNumber): string[] {
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
