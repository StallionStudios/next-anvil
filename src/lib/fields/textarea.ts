import type { BaseFieldOptions } from "./types";

export interface TextareaFieldOptions extends BaseFieldOptions {
    rows?: number;
    maxLength?: number;
    minLength?: number;
  }

export interface TextareaFieldSchema {
    type: "textarea";
    label: string;
    required: boolean;
    readOnly: boolean;
    rows: number;
    maxLength?: number;
    minLength?: number;
    placeholder: string;
    size: TextareaFieldOptions["size"];
  }

export function textarea(options: TextareaFieldOptions): TextareaFieldSchema {
    return {
      type: "textarea",
      label: options.label,
      required: options.required ?? false,
      readOnly: options.readOnly ?? false,
      rows: options.rows ?? 4,
      maxLength: options.maxLength ?? 524288,
      minLength: options.minLength ?? 0,
      placeholder: options.placeholder ?? "",
      size: options.size ?? "medium",
    };
  }