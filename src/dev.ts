import { ZodSchema } from "zod";
import { zodSchemaToMarkdown } from "./zodSchemaToMarkdown";
//import { yourZodSchema } from "./yourZodSchemaPath";

const callZodToMarkdown = (schema: ZodSchema, title: string, schemaName: string) => {
    const markdownSchema = zodSchemaToMarkdown(schema, title, schemaName);
    return console.log(markdownSchema);
}

// ### Usage

// callZodToMarkdown(yourZodSchema, "Title for your Zod schema Markdown docs", "yourZodSchema");
