export interface TableColumn {
  name: string;
  label?: string;
  orderable?: "asc" | "desc";
  visible?: "always" | "never" | "toggle";
}

export interface TableSchema {
  columns: TableColumn[];
}

export function defineTableSchema(schema: TableSchema) {
  return schema;
}
