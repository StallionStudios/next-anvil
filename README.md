# Anvil CLI

CLI tool for the Anvil framework - a Next.js framework for creating admin dashboards.

## Installation

```bash
npm install -g anvil
```

Or use it locally in your project:

```bash
npm install --save-dev anvil
```

## Usage

### Create a Resource

Generate a new resource with form and table components:

```bash
anvil forge:resource <name>
```

Example:
```bash
anvil forge:resource product
```

This will create:
- `src/lib/resources/products/index.ts`
- `src/lib/resources/products/form.ts`
- `src/lib/resources/products/table.ts`

Run Prisma migrations:

```bash
anvil db:migrate
```

This executes `npx prisma migrate dev && npx prisma generate`.

## Requirements

- Node.js 18.0.0 or higher
- A Next.js project
- Prisma configured (`db:migrate` commands)

## License

ISC

