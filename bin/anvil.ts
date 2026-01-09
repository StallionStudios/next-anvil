import { Command } from "commander";
import { forgeResource } from "./commands/forge/resource.js";
import { execSync } from "child_process";

const program = new Command();

program.name("anvil").description("Anvil framework CLI").version("0.1.0");

program
  .command("forge:resource <name>")
  .description("Create a new resource")
  .action(forgeResource);


program
  .command("db:migrate")
  .description("Run database migrations")
  .action(() => {
    execSync("npx prisma migrate dev && npx prisma generate", {
      stdio: "inherit",
    });
  });

program.parse();
