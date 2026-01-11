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
const targetAdminDir = join(projectPath, "src", "app", "admin");
if (existsSync(bootstrapAdminDir)) {
  cpSync(bootstrapAdminDir, targetAdminDir, { recursive: true });
  console.log("  ✅ Copied admin folder to src/app/admin");
}

// Copy components folder to src/components
const bootstrapComponentsDir = join(bootstrapDir, "components");
const targetComponentsDir = join(projectPath, "src", "components");
if (existsSync(bootstrapComponentsDir)) {
  mkdirSync(join(projectPath, "src"), { recursive: true });
  cpSync(bootstrapComponentsDir, targetComponentsDir, { recursive: true });
  console.log("  ✅ Copied components folder to src/components");
}

// Copy actions.ts to anvil/actions.ts
const bootstrapActionsPath = join(bootstrapDir, "actions.ts");
const targetActionsDir = join(projectPath, "src", "lib", "anvil");
if (existsSync(bootstrapActionsPath)) {
  mkdirSync(targetActionsDir, { recursive: true });
  cpSync(bootstrapActionsPath, join(targetActionsDir, "actions.ts"));
  console.log("  ✅ Copied actions.ts to src/lib/anvil/actions.ts");
}

// Step 3: Add Anvil-specific files and configuration
console.log("\n🔨 Setting up Anvil configuration...");

// Step 4: Install Prisma and dependencies
console.log("\n📦 Installing Prisma and database dependencies...");
try {
  execSync("npm install prisma @types/node @types/pg --save-dev", {
    stdio: "inherit",
    cwd: projectPath,
  });
  execSync("npm install @prisma/client @prisma/adapter-pg pg dotenv", {
    stdio: "inherit",
    cwd: projectPath,
  });
} catch (error) {
  console.error("Failed to install Prisma:", error);
  process.exit(1);
}

// Step 5: Initialize Prisma client
console.log("\n🔧 Initializing Prisma client...");
try {
  execSync("npx prisma init", {
    stdio: "inherit",
    cwd: projectPath,
  });
} catch (error) {
  console.warn("⚠️  Prisma initialization failed.");
}

console.log("\n✅ Anvil setup complete!");
console.log("\n📝 Next steps:");
console.log(`  1. cd ${projectName}`);
console.log("  2. Update .env.local with your database URL");
console.log("  3. Run: anvil db:migrate");
console.log("  4. Run: npm run dev");
console.log("  5. Visit: http://localhost:3000/admin");
console.log("\n🎉 Happy coding!");
