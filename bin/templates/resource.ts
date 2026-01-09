export function indexTemplate(singular: string) {
  return `
import { defineResource } from "@/lib/anvil/resource";
import form from "./form";
import table from "./table";

export default defineResource({
  model: "${singular}",
  form,
  table,
});
  `;
}

export function formTemplate(singular: string) {
  return `
import { defineFormSchema } from "@/lib/anvil/form";
import { text } from "@/lib/anvil/fields";

export default defineFormSchema({
  fields: {
    name: text({
      label: "Name",
      required: true,
      placeholder: "Enter ${singular} name",
    }),
  },
});
  `;
}

export function tableTemplate() {
  return `
import { defineTableSchema } from "@/lib/anvil/table";

export default defineTableSchema({
  columns: [
    { name: "id", label: "ID", visible: "never" },
    { name: "name", label: "Name" },
    { name: "createdAt", label: "Created At" },
  ],
});
  `;
}
