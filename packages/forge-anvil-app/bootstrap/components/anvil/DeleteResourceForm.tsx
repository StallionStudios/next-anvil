/**
 * DeleteResourceForm - Client component for confirming deletion
 */

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteResourceFormProps {
  record: Record<string, any>;
  resourceLabel: string;
  onDelete: () => Promise<void>;
}

export function DeleteResourceForm({
  record,
  resourceLabel,
  onDelete,
}: DeleteResourceFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      await onDelete();
      router.push(`/admin/`);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to delete record");
      setIsDeleting(false);
    }
  }

  function handleCancel() {
    router.back();
  }

  // Get a display value for the record (prefer name, email, or id)
  const displayValue =
    record.name ||
    record.email ||
    record.title ||
    (record.firstName && record.lastName
      ? `${record.firstName} ${record.lastName}`
      : record.firstName || record.lastName) ||
    `#${record.id}`;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this {resourceLabel.toLowerCase()}?
          This action cannot be undone.
        </p>
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
          <p className="font-medium text-gray-900">{displayValue}</p>
          {record.email && (
            <p className="text-sm text-gray-600 mt-1">{record.email}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isDeleting}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

