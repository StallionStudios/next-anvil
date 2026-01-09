import { BaseFieldOptions } from "./types";

type SelectOptions = { label: string; value: string }[] | string[];

export interface SelectFieldOptions extends BaseFieldOptions {
    options: SelectOptions;
  }

export interface SelectFieldSchema {
    type: "select";
    options: SelectOptions;
    label: string;
    required: boolean;
    readOnly: boolean;
    placeholder: string;
    size: SelectFieldOptions["size"];
  }
export function select(options: SelectFieldOptions): SelectFieldSchema {
    return {
      type: "select",
      options: options.options,
      label: options.label,
      required: options.required ?? false,
      readOnly: options.readOnly ?? false,
      placeholder: options.placeholder ?? "",
      size: options.size ?? "medium",
    };
  }