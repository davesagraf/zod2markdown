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

#### Example:

```bash

npm run cli -- -s src/schemas/configSchema.ts -e configSchema -t 'App config schema envs document' -o ../Desktop/app_config_envs_doc.md
```

So, for example:

If you have this code in `src/schemas/user/userSchema.ts`:

```typescript

import { z } from "zod";

export const userSchema = z.object({
    fullName: z.string().describe('Name of the User'),
    email: z.string().email().describe('Email of the User'),
    login: z.string().min(3).max(30).describe('Login/username of the User'),
    password: z.string().min(8).max(50).describe('Password of the User')
})
```

And you run:

```bash

npm run cli -- -s src/schemas/user/userSchema.ts -e userSchema -t 'User validation schema document' -o ../Desktop/user_validation_schema_doc.md
```

You should get this:
```md

## User validation schema document

### userSchema

| Property | Type | Required | Description | Default |
|----------|------|----------|-------------|---------|
| fullName | string | Yes | Name of the User |  |
| email | string (Must be a valid email) | Yes | Email of the User |  |
| login | string (Minimum length: 3, Maximum length: 30) | Yes | Login/username of the User |  |
| password | string (Minimum length: 8, Maximum length: 50) | Yes | Password of the User |  |

```
## Inspired by 
[zod2md](https://github.com/matejchalk/zod2md)

Thanks [matejchalk](https://github.com/matejchalk)! (haven't really used your `converter`, `formatter`, `loader` or `types`, though)