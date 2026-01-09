import pluralize from "pluralize-esm";
import type { FormSchema } from "./form";
import type { TableSchema } from "./table";

// Model name type - this will be a string that matches Prisma model names
// Developers should use the generated Prisma.ModelName type from their project
type ModelName = string;

export interface ResourceConfig {
  model: ModelName;
  label?: string;
  form: FormSchema;
  editForm?: FormSchema;
  table: TableSchema;
}

export interface AnvilResource {
  model: ModelName;
  slug: string;
  label: string;
  form: FormSchema;
  editForm: FormSchema;
  table: TableSchema;
}
export function defineResource(config: ResourceConfig): AnvilResource {
  if (!config.model) throw new Error("Model is required");
  if (!config.label) config.label = pluralize(config.model);
  if (!config.table) throw new Error("Table schema is required");
  if (!config.form) throw new Error("Form schema is required");
  if (!config.editForm) config.editForm = config.form;

  return {
    model: config.model,
    label: config.label,
    slug: pluralize(config.model.toLowerCase()),
    form: config.form,
    editForm: config.editForm,
    table: config.table,
  };
}
