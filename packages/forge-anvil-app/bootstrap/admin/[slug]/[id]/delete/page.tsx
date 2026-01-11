/**
 * Admin page for deleting resources
 * Server Component - handles deletion with confirmation
 */

import { deleteRecord, getRecord } from "@/lib/anvil/actions";
import { AnvilResource } from "next-anvil/resource";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { DeleteResourceForm } from "@/components/anvil/DeleteResourceForm";

export default async function DeleteResourcePage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const resource = (await import(`@/lib/resources/${slug}`))
    .default as AnvilResource;

  // Fetch the existing record
  const record = await getRecord(resource, id);
  if (!record) {
    notFound();
  }

  async function handleDelete() {
    "use server";
    const result = await deleteRecord(resource, id);
    if (result.success) {
      redirect(`/admin/${resource.slug}`);
    } else {
      throw new Error(result.errors?.[0]?.message || "Failed to delete record");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Delete {resource.label.slice(0, -1)}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          This action cannot be undone. Please confirm that you want to delete
          this {resource.model.toLowerCase()}.
        </p>
      </div>
      <DeleteResourceForm
        record={record}
        resourceLabel={resource.model.toLowerCase()}
        onDelete={handleDelete}
      />
    </div>
  );
}
