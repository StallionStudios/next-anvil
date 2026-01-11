/**
 * TextareaField - Textarea field component
 */

import { FieldWrapper } from "./FieldWrapper";
import { TextareaFieldSchema } from "@/lib/fields";

interface TextareaFieldProps {
  fieldName: string;
  fieldSchema: TextareaFieldSchema;
  value: any;
  error?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

export function TextareaField({
  fieldName,
  fieldSchema,
  value,
  error,
  disabled,
  onChange,
}: TextareaFieldProps) {
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
      <textarea
        id={fieldId}
        name={fieldName}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || fieldSchema.readOnly}
        rows={fieldSchema.rows || 4}
        placeholder={fieldSchema.placeholder}
        className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        } ${fieldSchema.readOnly ? "bg-gray-100" : ""}`}
      />
    </FieldWrapper>
  );
}
