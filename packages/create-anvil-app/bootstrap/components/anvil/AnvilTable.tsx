import { AnvilResource } from "next-anvil/resource";
import { TableColumn } from "next-anvil/table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AnvilTable({
  resource,
}: {
  resource: AnvilResource;
}) {
  const records = await (prisma as any)[resource.model].findMany();

  if (records.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg">No records found</p>
        <p className="text-gray-400 text-sm mt-2">
          Get started by creating a new {resource.label.toLowerCase()}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {resource.table.columns.map((col: TableColumn) => {
                if (col.visible === "never") return null;
                return (
                  <th
                    key={col.name}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.label || col.name}
                  </th>
                );
              })}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record: any) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {resource.table.columns.map((col: TableColumn) => {
                  if (col.visible === "never") return null;
                  const value = record[col.name];
                  let displayValue = value;

                  if (value === null || value === undefined) {
                    displayValue = (
                      <span className="text-gray-400 italic">-</span>
                    );
                  } else if (value instanceof Date) {
                    displayValue = new Date(value).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                  } else if (typeof value === "boolean") {
                    displayValue = (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          value
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {value ? "Yes" : "No"}
                      </span>
                    );
                  }

                  return (
                    <td
                      key={col.name}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {displayValue}
                    </td>
                  );
                })}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/${resource.slug}/${record.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/${resource.slug}/${record.id}/delete`}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
