import { BaseFieldOptions } from "./types";

export interface DateFieldOptions extends BaseFieldOptions {
    minDate?: Date;
    maxDate?: Date;
}

export interface DateFieldSchema {
    type: "date";
    label: string;
    required: boolean;
    readOnly: boolean;
    minDate: Date;
    maxDate: Date;
    size: DateFieldOptions["size"];
}

export function date(options: DateFieldOptions): DateFieldSchema {
    const minDate = options.minDate ? options.minDate : new Date(1900, 0, 1);
    const maxDate = options.maxDate ? options.maxDate : new Date(2100, 0, 1);
    return {
      type: "date",
      label: options.label,
      required: options?.required ?? false,
      readOnly: options?.readOnly ?? false,
      size: options?.size ?? "medium",
      minDate: minDate,
      maxDate: maxDate,
    };
  }