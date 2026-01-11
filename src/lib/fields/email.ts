import type { BaseFieldOptions } from "./types";

export interface EmailFieldOptions extends BaseFieldOptions {
    type: "email";
    unique?: boolean;
  }

  export interface EmailFieldSchema {
    type: "email",
    label: string,
    required: boolean,
    readOnly: boolean,
    unique: boolean,
    placeholder: string,
    size: EmailFieldOptions["size"],
  }

export function email(options: EmailFieldOptions): EmailFieldSchema {
    return {
      type: "email",
      label: options.label,
      required: options.required ?? false,
      readOnly: options.readOnly ?? false,
      unique: options.unique ?? false,
      placeholder: options.placeholder ?? "",
      size: options.size ?? "medium",
    };
  }