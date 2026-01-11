/**
 * Admin page for editing resources
 * Server Component - handles data fetching and server actions
 */

import { EditResourceForm } from "@/components/anvil/EditResourceForm";
import { updateRecord, getRecord } from "@/lib/anvil/actions";
import { AnvilResource } from "@/lib/anvil/resource";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function EditResourcePage({
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

  async function handleUpdate(data: Record<string, any>) {
    "use server";
    const result = await updateRecord(resource, id, data);
    if (result.success) {
      redirect(`/admin/${resource.slug}`);
    } else {
      throw new Error(result.errors?.[0]?.message || "Failed to update record");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Edit {resource.model.toLowerCase()}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the information below to modify this{" "}
          {resource.model.toLowerCase()}.
        </p>
      </div>
      <EditResourceForm
        schema={resource.editForm}
        initialData={record}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
