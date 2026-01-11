/**
 * DateField - Date input field component
 */

import { FieldWrapper } from "./FieldWrapper";
import { DateFieldSchema } from "@/lib/fields";

interface DateFieldProps {
  fieldName: string;
  fieldSchema: DateFieldSchema;
  value: any;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function DateField({
  fieldName,
  fieldSchema,
  value,
  error,
  disabled,
  onChange,
}: DateFieldProps) {
  const fieldId = `field-${fieldName}`;
  const displayLabel = fieldSchema.label;

  // Convert date value to YYYY-MM-DD format for input
  const dateValue = (() => {
    if (!value) return "";
    if (value instanceof Date) {
      return value.toISOString().split("T")[0];
    }
    // If it's already in YYYY-MM-DD format, return as is
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
    // Try to parse and convert
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    } catch {
      // Invalid date, return empty
    }
    return "";
  })();

  return (
    <FieldWrapper
      fieldId={fieldId}
      label={displayLabel}
      required={fieldSchema.required}
      error={error}
      size={fieldSchema.size}
    >
      <input
        type="date"
        id={fieldId}
        name={fieldName}
        value={dateValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || fieldSchema.readOnly}
        className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${fieldSchema.readOnly ? "bg-gray-100" : ""}`}
      />
    </FieldWrapper>
  );
}
