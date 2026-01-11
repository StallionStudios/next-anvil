/**
 * EditResourceForm - Client component wrapper for editing resources
 * Separates client-side form logic from server-side data operations
 */

"use client";

import { FormSchema } from "next-anvil/form";
import { AnvilForm } from "./AnvilForm";
import { useRouter } from "next/navigation";

interface EditResourceFormProps {
  schema: FormSchema;
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}

export function EditResourceForm({
  schema,
  initialData,
  onSubmit,
}: EditResourceFormProps) {
  const router = useRouter();

  async function handleSubmit(data: Record<string, any>) {
    try {
      await onSubmit(data);
      router.push(`/admin/`);
      router.refresh();
    } catch (error: any) {
      // Error handling is done in the server action
      throw error;
    }
  }

  function handleCancel() {
    router.back();
  }

  return (
    <AnvilForm
      schema={schema}
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Update"
      cancelLabel="Cancel"
    />
  );
}

