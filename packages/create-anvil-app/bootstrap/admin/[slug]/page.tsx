/**
 * Admin page for Users resource
 * Generic renderer that reads from resource.ts
 */

import AnvilTable from "@/components/admin/AnvilTable";
import Link from "next/link";
import { AnvilResource } from "@/lib/anvil/resource";

export default async function ResourceAdminPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = (await import(`@/lib/resources/${slug}`))
    .default as AnvilResource;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{resource.label}</h1>
        <Link
          href={`/admin/${resource.slug}/create`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Create {resource.label.slice(0, -1)}
        </Link>
      </div>
      <AnvilTable resource={resource} />
    </div>
  );
}
