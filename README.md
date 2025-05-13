# Zod 2 Markdown tiny lib

## Get

Run:

```bash
git clone https://github.com/davesagraf/zod2markdown.git
```

## Install

Run:

```bash
npm i
```

## Run

Check the code in `src/dev.ts`, add your Zod schemas, provide arguments and then run:

```bash
npm run dev
```

## CLI

You can also use the CLI version of the script.

Run:

```bash

npm run cli
```

### CLI arguments

| Option                | Type     | Required |                    Description                    |
| :-------------------- | :------- | :------: | :-----------------------------------------------: |
| `-s, --schema <path>` | `string` |   yes    |      Path to file containing the Zod schema       |
| `-e, --export <n>`    | `string` |   yes    |            Name of the exported schema            |
| `-t, --title <title>` | `string` |   yes    |            Title for the documentation            |
| `-n, --name <n>`      | `string` |    no    |   Name for the schema (defaults to export name)   |
| `-o, --output <path>` | `string` |    no    | Path to output Markdown file (defaults to stdout) |
| `-a, --append`        | `string` |    no    |   Append to output file instead of overwriting    |

For example:

```bash

npm run cli -- -s src/schemas/configSchema.ts -e configSchema -t 'App config schema envs document' -o ../Desktop/app_config_envs_doc.md
```
