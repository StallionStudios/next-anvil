import { FieldSchema } from "./fields/types";

export type FormFields = Record<string, FieldSchema>;

export interface FormSchema {
  fields: FormFields;
}

export function defineFormSchema(schema: FormSchema) {
  return schema;
}
