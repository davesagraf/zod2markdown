import { SchemaMeta } from "@src/interface/ISchemaMeta";
import { z } from "zod";
import { processSchema } from "../processSchema";

/**
 * Process ZodIntersection schema
 */
export function processIntersectionSchema(schema: z.ZodIntersection<any, any>, meta: SchemaMeta, indent = 0): string {
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
