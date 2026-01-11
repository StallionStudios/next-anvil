/**
 * SelectField - Select dropdown field component
 */

import { FieldWrapper } from "./FieldWrapper";
import type { SelectFieldSchema } from "@/lib/fields/select";

interface SelectFieldProps {
  fieldName: string;
  fieldSchema: SelectFieldSchema;
  value: any;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function SelectField({
  fieldName,
  fieldSchema,
  value,
  error,
  disabled,
  onChange,
}: SelectFieldProps) {
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
      <select
        id={fieldId}
        name={fieldName}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || fieldSchema.readOnly}
        className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${fieldSchema.readOnly ? "bg-gray-100" : ""}`}
      >
        <option value="">Select {displayLabel}</option>
        {fieldSchema.options.map((option) => {
          const optionObject =
            typeof option === "string"
              ? { label: option, value: option }
              : option;
          return (
            <option key={optionObject.value} value={optionObject.value}>
              {optionObject.label}
            </option>
          );
        })}
      </select>
    </FieldWrapper>
  );
}
