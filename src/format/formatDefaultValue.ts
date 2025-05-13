/**
 * Format default value for display
 */
export function formatDefaultValue(value: any): string {
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