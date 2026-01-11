import type { BaseFieldOptions } from "./types";

export interface TextFieldOptions extends BaseFieldOptions {
    unique?: boolean;
    minLength?: number;
    maxLength?: number;
  }

export interface TextFieldSchema {
    type: "text";
    label: string;
    required: boolean;
    readOnly: boolean;
    unique: boolean;
    placeholder: string;
    minLength?: number;
    maxLength?: number;
    size: TextFieldOptions["size"];
  }
export function text(options: TextFieldOptions): TextFieldSchema {
    return {
      type: "text",
      label: options.label,
      required: options.required ?? false,
      readOnly: options.readOnly ?? false,
      unique: options.unique ?? false,
      placeholder: options.placeholder ?? "",
      minLength: options.minLength ?? 0,
      maxLength: options.maxLength ?? 255,
      size: options.size ?? "medium",
    };
  }