/**
 * CreateResourceForm - Client component wrapper for creating resources
 * Separates client-side form logic from server-side data operations
 */

"use client";

import { FormSchema } from "next-anvil/form";
import { AnvilForm } from "./AnvilForm";
import { useRouter } from "next/navigation";

interface CreateResourceFormProps {
  schema: FormSchema;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}

export function CreateResourceForm({
  schema,
  onSubmit,
}: CreateResourceFormProps) {
  const router = useRouter();

  async function handleSubmit(data: Record<string, any>) {
    try {
      await onSubmit(data);
      // Server action handles redirect, but refresh in case of client-side navigation
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
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel="Create"
      cancelLabel="Cancel"
    />
  );
}
