#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectName = process.argv[2];

if (!projectName) {
  console.error("Please provide a project name:");
  console.error("  npx create-anvil-app <project-name>");
  process.exit(1);
}

const projectPath = join(process.cwd(), projectName);

if (existsSync(projectPath)) {
  console.error(`Directory ${projectName} already exists.`);
  process.exit(1);
}

console.log(`Creating Next-anvil app: ${projectName}\n`);

// Step 1: Create Next.js app
console.log("📦 Creating Next.js app...");
try {
  execSync(
    `npx create-next-app@latest ${projectName} --typescript --tailwind --app --import-alias "@/*" --use-npm --yes`,
    { stdio: "inherit", cwd: process.cwd() }
  );
} catch (error) {
  console.error("Failed to create Next.js app:", error);
  process.exit(1);
}

console.log("\n✅ Next.js app created successfully!");

// Step 2: Install next-anvil
console.log("\n📦 Installing next-anvil...");
try {
  execSync("npm install next-anvil", {
    stdio: "inherit",
    cwd: projectPath,
  });
} catch (error) {
  console.error("Failed to install next-anvil:", error);
  process.exit(1);
}

// Step 2.5: Copy bootstrap files
console.log("\n📋 Copying Anvil bootstrap files...");
// When installed, __dirname points to dist/, so go up one level to find bootstrap
const bootstrapDir = join(__dirname, "..", "bootstrap");

// Copy admin folder to app/admin
const bootstrapAdminDir = join(bootstrapDir, "admin");
const targetAdminDir = join(projectPath, "app", "admin");
if (existsSync(bootstrapAdminDir)) {
  cpSync(bootstrapAdminDir, targetAdminDir, { recursive: true });
  console.log("  ✅ Copied admin folder to app/admin");
}

// Copy components folder to src/components
const bootstrapComponentsDir = join(bootstrapDir, "components");
const targetComponentsDir = join(projectPath, "src", "components");
if (existsSync(bootstrapComponentsDir)) {
  mkdirSync(join(projectPath, "src"), { recursive: true });
  cpSync(bootstrapComponentsDir, targetComponentsDir, { recursive: true });
  console.log("  ✅ Copied components folder to src/components");
}

// Step 3: Add Anvil-specific files and configuration
console.log("\n🔨 Setting up Anvil configuration...");

// Create lib/resources directory
const resourcesDir = join(projectPath, "anvil", "resources");
mkdirSync(resourcesDir, { recursive: true });

// Create .gitkeep to ensure directory exists
writeFileSync(join(resourcesDir, ".gitkeep"), "");

// Update package.json to add anvil script
const packageJsonPath = join(projectPath, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

if (!packageJson.scripts) {
  packageJson.scripts = {};
}

packageJson.scripts.anvil = "anvil";

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

// Create app layout with Anvil styles import
const appLayoutPath = join(projectPath, "app", "layout.tsx");
if (existsSync(appLayoutPath)) {
  let layoutContent = readFileSync(appLayoutPath, "utf-8");
  
  // Add Anvil styles import if not already present
  if (!layoutContent.includes("next-anvil/styles.css")) {
    // Find the last import statement
    const lastImportIndex = layoutContent.lastIndexOf("import");
    const nextLineAfterLastImport = layoutContent.indexOf("\n", lastImportIndex) + 1;
    
    layoutContent =
      layoutContent.slice(0, nextLineAfterLastImport) +
      'import "next-anvil/styles.css";\n' +
      layoutContent.slice(nextLineAfterLastImport);
    
    writeFileSync(appLayoutPath, layoutContent);
  }
}

// Create example .env.local with Prisma DATABASE_URL
const envLocalPath = join(projectPath, ".env.local");
if (!existsSync(envLocalPath)) {
  writeFileSync(
    envLocalPath,
    `# Database
DATABASE_URL="postgresql://user:password@localhost:5432/anvil?schema=public"

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
`
  );
}

// Create example prisma schema
const prismaDir = join(projectPath, "prisma");
mkdirSync(prismaDir, { recursive: true });

const prismaSchemaPath = join(prismaDir, "schema.prisma");
if (!existsSync(prismaSchemaPath)) {
  writeFileSync(
    prismaSchemaPath,
    `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Example model - customize as needed
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`
  );
}


console.log("\n✅ Anvil setup complete!");
console.log("\n📝 Next steps:");
console.log(`  1. cd ${projectName}`);
console.log("  2. Update .env.local with your database URL");
console.log("  3. Run: anvil db:migrate");
console.log("  4. Run: npm run dev");
console.log("  5. Visit: http://localhost:3000/admin");
console.log("\n🎉 Happy coding!");
