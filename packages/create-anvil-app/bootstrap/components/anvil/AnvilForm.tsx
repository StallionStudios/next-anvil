"use client";

import { useState } from "react";
import type { FieldConfig } from "next-anvil/fields";
import { FormSchema } from "next-anvil/form";
import {
  TextField,
  EmailField,
  SelectField,
  DateField,
  NumberField,
  TextareaField,
} from "next-anvil/components/fields";

interface AnvilFormProps {
  schema: FormSchema;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel?: () => void;
  submitting?: boolean;
  errors?: Record<string, string>;
  submitLabel?: string;
  cancelLabel?: string;
}

export function AnvilForm({
  schema,
  initialData = {},
  onSubmit,
  onCancel,
  submitting: externalSubmitting,
  errors: externalErrors = {},
  submitLabel = "Save",
  cancelLabel = "Cancel",
}: AnvilFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [internalSubmitting, setInternalSubmitting] = useState(false);
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>(
    {}
  );

  const submitting = externalSubmitting ?? internalSubmitting;
  const errors = { ...internalErrors, ...externalErrors };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInternalSubmitting(true);
    setInternalErrors({});

    try {
      await onSubmit(formData);
    } catch (error: any) {
      const errorMap: Record<string, string> = {};
      if (error.field) {
        errorMap[error.field] = error.message;
      } else {
        errorMap._general = error.message || "An error occurred";
      }
      setInternalErrors(errorMap);
    } finally {
      setInternalSubmitting(false);
    }
  }

  function renderField(
    fieldName: string,
    fieldConfig: FieldConfig,
    value: any
  ) {
    // Skip hidden fields in form rendering
    if (fieldConfig.type === "hidden") {
      return null;
    }

    const fieldError = errors[fieldName];
    const isDisabled = submitting || fieldConfig.readOnly;

    const commonProps = {
      fieldName,
      fieldConfig: fieldConfig as any,
      value,
      error: fieldError,
      disabled: isDisabled,
    };

    switch (fieldConfig.type) {
      case "text":
        return (
          <TextField
            key={fieldName}
            {...commonProps}
            onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
          />
        );

      case "email":
        return (
          <EmailField
            key={fieldName}
            {...commonProps}
            onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
          />
        );

      case "select":
        return (
          <SelectField
            key={fieldName}
            {...commonProps}
            onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
          />
        );

      case "date":
        return (
          <DateField
            key={fieldName}
            {...commonProps}
            onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
          />
        );

      case "number":
        return (
          <NumberField
            key={fieldName}
            {...commonProps}
            onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
          />
        );

      case "textarea":
        return (
          <TextareaField
            key={fieldName}
            {...commonProps}
            onChange={(val) => setFormData({ ...formData, [fieldName]: val })}
          />
        );

      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      {errors._general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{errors._general}</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        {Object.entries(schema.fields || {}).map(([fieldName, fieldConfig]) =>
          renderField(fieldName, fieldConfig, formData[fieldName])
        )}
      </div>

      <div className="mt-8 flex gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
        )}
      </div>
    </form>
  );
}
