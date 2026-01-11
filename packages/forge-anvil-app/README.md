# create-anvil-app

Create a new Next-anvil application with a single command.

## Usage

```bash
npx create-anvil-app my-app
```

This will:
1. Create a new Next.js app with TypeScript and Tailwind CSS
2. Install `next-anvil` package
3. Set up Anvil-specific configuration
4. Create example Prisma schema
5. Create an admin dashboard page

## What Gets Created

- Next.js app with TypeScript and Tailwind CSS
- `next-anvil` package installed
- `lib/resources/` directory for your resources
- Example Prisma schema
- Example admin page at `/admin`
- `.env.local` with database configuration

## Next Steps

After running `create-anvil-app`:

1. `cd my-app`
2. Update `.env.local` with your database URL
3. Run `anvil db:migrate` to set up the database
4. Run `npm run dev` to start the development server
5. Visit `http://localhost:3000/admin`
