/**
 * Admin dashboard/index page
 * Lists all available resources
 */

import Link from "next/link";

// TODO: Auto-discover resources from /app/admin/*/resource.ts
const resources = [{ slug: "users", label: "Users" }];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your application resources
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Link
            key={resource.slug}
            href={`/admin/${resource.slug}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              {resource.label}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Manage {resource.label.toLowerCase()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
