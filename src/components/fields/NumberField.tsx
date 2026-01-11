/**
 * NumberField - Number input field component
 */

import { FieldWrapper } from "./FieldWrapper";
import type { NumberFieldSchema } from "@/lib/fields/number";

interface NumberFieldProps {
  fieldName: string;
  fieldSchema: NumberFieldSchema;
  value: any;
  error?: string;
  disabled?: boolean;
  onChange: (value: number | null) => void;
}

export function NumberField({
  fieldName,
  fieldSchema,
  value,
  error,
  disabled,
  onChange,
}: NumberFieldProps) {
  const fieldId = `field-${fieldName}`;
  const displayLabel = fieldSchema.label || fieldName;

  return (
    <FieldWrapper
      fieldId={fieldId}
      label={displayLabel}
      required={fieldSchema.required}
      error={error}
      size={fieldSchema.size}
    >
      <input
        type="number"
        id={fieldId}
        name={fieldName}
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value ? Number(e.target.value) : null)
        }
        disabled={disabled || fieldSchema.readOnly}
        min={fieldSchema.min}
        max={fieldSchema.max}
        placeholder={fieldSchema.placeholder}
        className={`w-full px-3 py-2 text-black  border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${fieldSchema.readOnly ? "bg-gray-100" : ""}`}
      />
    </FieldWrapper>
  );
}
