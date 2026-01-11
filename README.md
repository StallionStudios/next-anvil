# Next-anvil

A Next.js framework for building admin dashboards. Next-anvil provides schema definitions, form field components, and a CLI tool to scaffold resources.

## Installation

### CLI Tool

Install globally:

```bash
npm install -g next-anvil
```

Or use it locally in your project:

```bash
npm install --save-dev next-anvil
```

### Library

Install as a dependency in your Next.js project:

```bash
npm install next-anvil
```

## CLI Usage

### Create a Resource

Generate resource scaffolding files:

```bash
anvil forge:resource <name>
```

Example:
```bash
anvil forge:resource product
```

This creates:
- `src/lib/resources/products/index.ts` - Resource definition
- `src/lib/resources/products/form.ts` - Form schema
- `src/lib/resources/products/table.ts` - Table schema

### Run Database Migrations

```bash
anvil db:migrate
```

This executes `npx prisma migrate dev && npx prisma generate`.

## Library Usage

### Import Styles

First, import the compiled Tailwind CSS:

```javascript
import "next-anvil/styles.css";
```

### Defining Field Schemas

Next-anvil provides field definition functions for building form schemas:

```typescript
import { text, email, number, select, date, textarea } from "next-anvil/fields";
import { defineFormSchema } from "next-anvil/form";

const formSchema = defineFormSchema({
  fields: {
    name: text({
      label: "Name",
      required: true,
      placeholder: "Enter name",
    }),
    email: email({
      label: "Email",
      required: true,
      unique: true,
    }),
    age: number({
      label: "Age",
      min: 0,
      max: 120,
    }),
    status: select({
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    }),
    birthDate: date({
      label: "Birth Date",
    }),
    bio: textarea({
      label: "Biography",
      rows: 4,
    }),
  },
});
```

### Defining Table Schemas

```typescript
import { defineTableSchema } from "next-anvil/table";

const tableSchema = defineTableSchema({
  columns: [
    { name: "id", label: "ID", visible: "never" },
    { name: "name", label: "Name" },
    { name: "email", label: "Email" },
    { name: "createdAt", label: "Created At" },
  ],
});
```

### Defining Resources

```typescript
import { defineResource } from "next-anvil/resource";
import form from "./form";
import table from "./table";

const productResource = defineResource({
  model: "Product",
  label: "Products",
  form,
  table,
});
```

### Using Field Components

Next-anvil provides React components for rendering form fields:

```tsx
import { TextField, EmailField, NumberField } from "next-anvil/components";

function MyForm() {
  const [formData, setFormData] = useState({});

  return (
    <form>
      <TextField
        fieldName="name"
        fieldSchema={formSchema.fields.name}
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
      />
      <EmailField
        fieldName="email"
        fieldSchema={formSchema.fields.email}
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
      />
    </form>
  );
}
```

Available field components:
- `TextField`
- `EmailField`
- `NumberField`
- `SelectField`
- `DateField`
- `TextareaField`
- `FieldWrapper` (base wrapper component)

### Package Exports

Next-anvil provides the following exports:

- `next-anvil/fields` - Field schema definition functions (text, email, number, select, date, textarea, hidden)
- `next-anvil/form` - Form schema utilities (`defineFormSchema`)
- `next-anvil/table` - Table schema utilities (`defineTableSchema`)
- `next-anvil/resource` - Resource definition utilities (`defineResource`)
- `next-anvil/components` - React field components
- `next-anvil/styles.css` - Compiled Tailwind CSS

## Requirements

- Node.js 18.0.0 or higher
- React 18.0.0 or higher
- Next.js 14.0.0 or higher
- Prisma (for database operations)

## License

ISC
