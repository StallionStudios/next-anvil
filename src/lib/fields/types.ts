/**
 * Core types for the admin framework
 */
import type { TextFieldOptions, TextFieldSchema } from "./text";
import type { EmailFieldOptions, EmailFieldSchema } from "./email";
import type { SelectFieldOptions, SelectFieldSchema } from "./select";
import type { DateFieldOptions, DateFieldSchema } from "./date";
import type { NumberFieldOptions, NumberFieldSchema } from "./number";
import type { TextareaFieldOptions, TextareaFieldSchema } from "./textarea";
import type { HiddenFieldOptions, HiddenFieldSchema } from "./hidden";

export type FieldType =
  | "text"
  | "email"
  | "select"
  | "date"
  | "number"
  | "textarea"
  | "hidden";

export type FieldSize = "large" | "medium" | "small" | "tiny";

export interface BaseFieldOptions {
  /**
   * Field label text
   */
  label: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Whether the field is read only
   */
  readOnly?: boolean;
  /**
   * Field placeholder text
   */
  placeholder?: string;
  /**
   * Field width size (large, medium, small, tiny):
   * - large = 100% width (full width)
   * - medium = 50% width
   * - small = 33.33% width
   * - tiny = 25% width
   * If not specified, defaults to large (100% width)
   */
  size?: FieldSize;
}

export type FieldOptions = TextFieldOptions | EmailFieldOptions | SelectFieldOptions | DateFieldOptions | NumberFieldOptions | TextareaFieldOptions | HiddenFieldOptions;

export type FieldSchema = TextFieldSchema | EmailFieldSchema | SelectFieldSchema | DateFieldSchema | NumberFieldSchema | TextareaFieldSchema | HiddenFieldSchema