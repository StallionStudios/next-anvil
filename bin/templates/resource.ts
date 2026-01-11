export function indexTemplate(singular: string) {
  return `
import { defineResource } from "next-anvil/resource";
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
import { defineFormSchema } from "next-anvil/form";
import { text } from "next-anvil/fields";

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
import { defineTableSchema } from "next-anvil/table";

export default defineTableSchema({
  columns: [
    { name: "id", label: "ID", visible: "never" },
    { name: "name", label: "Name" },
    { name: "createdAt", label: "Created At" },
  ],
});
  `;
}
