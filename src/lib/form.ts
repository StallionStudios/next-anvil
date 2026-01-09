import { FieldOptions } from "./fields/types";

export type FormFields = Record<string, FieldOptions>;

export interface FormSchema {
  fields: FormFields;
}

export function defineFormSchema(schema: FormSchema) {
  return schema;
}
