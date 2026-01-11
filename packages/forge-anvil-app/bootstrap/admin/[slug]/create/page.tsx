/**
 * Admin page for creating resources
 * Server Component - handles data fetching and server actions
 */

import { CreateResourceForm } from "@/components/anvil/CreateResourceForm";
import { createRecord } from "@/lib/anvil/actions";
import { redirect } from "next/navigation";
import { AnvilResource } from "next-anvil/resource";

export default async function CreateResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = (await import(`@/lib/resources/${slug}`))
    .default as AnvilResource;

  async function handleCreate(data: Record<string, any>) {
    "use server";
    const result = await createRecord(resource, data);
    if (result.success) {
      redirect(`/admin/${resource.slug}`);
    } else {
      throw new Error(result.errors?.[0]?.message || "Failed to create record");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Create {resource.label.slice(0, -1)}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the form below to create a new {resource.label.toLowerCase()}.
        </p>
      </div>
      <CreateResourceForm schema={resource.form} onSubmit={handleCreate} />
    </div>
  );
}
