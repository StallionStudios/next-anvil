import type { BaseFieldOptions } from "./types";

export interface NumberFieldOptions extends BaseFieldOptions {
    min?: number;
    max?: number;
  }

export interface NumberFieldSchema {
    type: "number";
    label: string;
    placeholder: string;
    required: boolean;
    readOnly: boolean;
    min?: number;
    max?: number;
    size: NumberFieldOptions["size"];
  }

export function number(options: NumberFieldOptions): NumberFieldSchema {
    return {
      type: "number",
      label: options.label,
      required: options?.required ?? false,
      readOnly: options?.readOnly ?? false,
      min: options?.min,
      max: options?.max,
      placeholder: options.placeholder ?? "",
      size: options.size ?? "medium",
    };
  }