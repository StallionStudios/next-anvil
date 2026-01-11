/**
 * FieldWrapper - Base component for form fields
 * Provides consistent label, error display, and styling
 */

import type { ReactNode } from "react";
import { FieldSize } from "@/lib/fields/types";

interface FieldWrapperProps {
  fieldId: string;
  label?: string;
  required?: boolean;
  error?: string;
  size?: FieldSize;
  children: ReactNode;
}

/**
 * Get grid column span class based on size
 * Uses a 60-column grid system for precise widths:
 * - large = 100% (60/60)
 * - medium = 50% (30/60)
 * - small = 33.33% (20/60)
 * - tiny = 25% (15/60)
 */
function getSizeClass(size?: FieldSize): string {
  const sizeMap: Record<FieldSize, string> = {
    large: "col-span-4 md:col-span-4", // 100% (60/60)
    medium: "col-span-4 md:col-span-3", // 50% (30/60)
    small: "col-span-4 md:col-span-2", // 33.33% (20/60)
    tiny: "col-span-4 md:col-span-1", // 25% (15/60)
  };
  return size ? sizeMap[size] : "col-span-4"; // Default to full width
}

export function FieldWrapper({
  fieldId,
  label,
  required,
  error,
  size,
  children,
}: FieldWrapperProps) {
  const sizeClass = getSizeClass(size);

  return (
    <div className={sizeClass}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
