import fs from "fs/promises";
import path from "path";
import pluralize from "pluralize-esm";
import {
  indexTemplate,
  formTemplate,
  tableTemplate,
} from "../../templates/resource";

export async function forgeResource(name: string) {
  const singular = name.charAt(0).toUpperCase() + name.slice(1);
  const plural = pluralize(singular);
  const pluralLower = plural.toLowerCase();
  const singularLower = singular.toLowerCase();

  const resourceDir = path.join(
    process.cwd(),
    "src/lib/anvil/resources",
    pluralLower
  );

  if (
    await fs
      .access(resourceDir)
      .then(() => true)
      .catch(() => false)
  ) {
    console.log(`${singular} Resource already exists`);
    return;
  }

  await fs.mkdir(resourceDir, { recursive: true });

  await Promise.all([
    fs.writeFile(path.join(resourceDir, "index.ts"), indexTemplate(singular)),
    fs.writeFile(path.join(resourceDir, "form.ts"), formTemplate(singular)),
    fs.writeFile(path.join(resourceDir, "table.ts"), tableTemplate()),
  ]);

  console.log(
    `✅ ${singular} Resource created at src/lib/resources/${pluralLower}/`
  );
  console.log(`   - index.ts`);
  console.log(`   - form.ts`);
  console.log(`   - table.ts`);
}
