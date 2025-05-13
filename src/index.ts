#!/usr/bin/env node

/**
 * Zod to Markdown CLI
 * A command-line tool to convert Zod schemas to Markdown documentation
 */

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { zodSchemaToMarkdown } from './zodSchemaToMarkdown';
import { ZodSchema } from 'zod';

const program = new Command();

// Setup CLI program
program
  .name('zod-to-markdown')
  .description('Convert Zod schemas to Markdown documentation')
  .version('1.0.0')
  .requiredOption('-s, --schema <path>', 'Path to file containing the Zod schema')
  .requiredOption('-e, --export <n>', 'Name of the exported schema')
  .requiredOption('-t, --title <title>', 'Title for the documentation')
  .option('-n, --name <n>', 'Name for the schema (defaults to export name)')
  .option('-o, --output <path>', 'Path to output Markdown file (defaults to stdout)')
  .option('-a, --append', 'Append to output file instead of overwriting')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    // Import the schema
    const schemaPath = path.resolve(options.schema);
    
    // Dynamic import of the module containing the schema
    // Note: This is using the dynamic import() which returns a Promise
    const schemaModule = await import(schemaPath);
    
    // Get the schema from the module
    const schema: ZodSchema = schemaModule[options.export];
    
    if (!schema) {
      console.error(`Error: Export '${options.export}' not found in '${schemaPath}'`);
      process.exit(1);
    }
    
    // Get the schema name (either from options or use export name)
    const schemaName = options.name || options.export;
    
    // Generate the Markdown
    const markdown = zodSchemaToMarkdown(schema, options.title, schemaName);
    
    // Output the Markdown
    if (options.output) {
      const outputPath = path.resolve(options.output);
      
      // Ensure the directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write to file (append or overwrite)
      if (options.append && fs.existsSync(outputPath)) {
        fs.appendFileSync(outputPath, '\n\n' + markdown);
        console.log(`Appended to ${outputPath}`);
      } else {
        fs.writeFileSync(outputPath, markdown);
        console.log(`Written to ${outputPath}`);
      }
    } else {
      // Output to stdout
      console.log(markdown);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();