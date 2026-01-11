/**
 * Generic CRUD server actions for resources
 */

"use server";

import { prisma } from "@/lib/prisma";
import type { AnvilResource } from "./resource";

export interface ActionError {
  field?: string;
  message: string;
}

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  errors?: ActionError[];
}

export interface ResourceRecord {
  id: number | string;
  [key: string]: any;
}

/**
 * List all records for a resource
 */
export async function listRecords(
  resource: AnvilResource
): Promise<ResourceRecord[]> {
  const model = resource.model as keyof typeof prisma;
  const modelClient = (prisma as any)[model];

  if (!modelClient || typeof modelClient.findMany !== "function") {
    throw new Error(`Model ${resource.model} not found in Prisma client`);
  }

  const records = await modelClient.findMany({
    orderBy: { id: "desc" },
  });

  return records;
}

/**
 * Get a single record by ID
 */
export async function getRecord(
  resource: AnvilResource,
  id: number | string
): Promise<ResourceRecord | null> {
  const model = resource.model as keyof typeof prisma;
  const modelClient = (prisma as any)[model];

  if (!modelClient || typeof modelClient.findUnique !== "function") {
    throw new Error(`Model ${resource.model} not found in Prisma client`);
  }

  const record = await modelClient.findUnique({
    where: { id: Number(id) },
  });

  return record;
}

/**
 * Validate form data against resource definition
 */
function validateFormData(
  resource: AnvilResource,
  data: Record<string, any>,
  isUpdate: boolean = false
): ActionError[] {
  const errors: ActionError[] = [];

  // Use form for create, editForm for update
  const formFields = isUpdate ? resource.editForm.fields : resource.form.fields;

  for (const [fieldName, fieldSchema] of Object.entries(formFields)) {
    const value = data[fieldName];

    // Skip hidden fields
    if (fieldSchema.type === "hidden") {
      continue;
    }

    // Skip validation for read-only fields on create
    if ("readOnly" in fieldSchema && fieldSchema.readOnly && !isUpdate) {
      continue;
    }

    // Required validation
    if (
      "required" in fieldSchema &&
      fieldSchema.required &&
      (value === null || value === undefined || value === "")
    ) {
      const label = "label" in fieldSchema ? fieldSchema.label : fieldName;
      errors.push({
        field: fieldName,
        message: `${label} is required`,
      });
    }

    // Type-specific validation
    if (value !== null && value !== undefined && value !== "") {
      if (fieldSchema.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({
            field: fieldName,
            message: `${fieldSchema.label || fieldName} must be a valid email`,
          });
        }
      }

      if (fieldSchema.type === "text" && "minLength" in fieldSchema) {
        if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
          errors.push({
            field: fieldName,
            message: `${fieldSchema.label || fieldName} must be at least ${
              fieldSchema.minLength
            } characters`,
          });
        }
      }

      if (fieldSchema.type === "text" && "maxLength" in fieldSchema) {
        if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
          errors.push({
            field: fieldName,
            message: `${fieldSchema.label || fieldName} must be no more than ${
              fieldSchema.maxLength
            } characters`,
          });
        }
      }

      if (fieldSchema.type === "number" && "min" in fieldSchema) {
        if (fieldSchema.min !== undefined && Number(value) < fieldSchema.min) {
          errors.push({
            field: fieldName,
            message: `${fieldSchema.label || fieldName} must be at least ${
              fieldSchema.min
            }`,
          });
        }
      }

      if (fieldSchema.type === "number" && "max" in fieldSchema) {
        if (fieldSchema.max !== undefined && Number(value) > fieldSchema.max) {
          errors.push({
            field: fieldName,
            message: `${fieldSchema.label || fieldName} must be no more than ${
              fieldSchema.max
            }`,
          });
        }
      }
    }
  }

  return errors;
}

/**
 * Transform form data based on field types
 * Converts date strings to Date objects for Prisma
 */
function transformFormData(
  resource: AnvilResource,
  data: Record<string, any>,
  isUpdate: boolean = false
): Record<string, any> {
  const formFields = isUpdate ? resource.editForm.fields : resource.form.fields;
  const transformed: Record<string, any> = {};

  for (const [fieldName, fieldSchema] of Object.entries(formFields)) {
    if (fieldSchema.type === "hidden") {
      continue;
    }
    if (
      !("readOnly" in fieldSchema && fieldSchema.readOnly) &&
      data[fieldName] !== undefined &&
      data[fieldName] !== null &&
      data[fieldName] !== ""
    ) {
      // Convert date strings to Date objects
      if (fieldSchema.type === "date") {
        const dateValue = data[fieldName];
        // If it's already a Date object, use it
        if (dateValue instanceof Date) {
          transformed[fieldName] = dateValue;
        } else if (typeof dateValue === "string") {
          // Convert "YYYY-MM-DD" to Date object
          // Add time component to make it a valid DateTime
          const date = new Date(dateValue + "T00:00:00.000Z");
          if (!isNaN(date.getTime())) {
            transformed[fieldName] = date;
          }
        }
      } else {
        transformed[fieldName] = data[fieldName];
      }
    } else if (data[fieldName] === "" && fieldSchema.type === "date") {
      // Handle empty date strings - set to null
      transformed[fieldName] = null;
    }
  }

  return transformed;
}

/**
 * Create a new record
 */
export async function createRecord(
  resource: AnvilResource,
  data: Record<string, any>
): Promise<ActionResult<any>> {
  // Validate
  const errors = validateFormData(resource, data, false);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  // Check unique constraints
  for (const [fieldName, fieldSchema] of Object.entries(resource.form.fields)) {
    if (fieldSchema.type === "email" || fieldSchema.type === "text") {
      if (fieldSchema.unique && data[fieldName]) {
        const model = resource.model as keyof typeof prisma;
        const modelClient = (prisma as any)[model];

        const existing = await modelClient.findFirst({
          where: { [fieldName]: data[fieldName] },
        });

        if (existing) {
          return {
            success: false,
            errors: [
              {
                field: fieldName,
                message: `${fieldSchema.label || fieldName} must be unique`,
              },
            ],
          };
        }
      }
    }
  }

  // Transform and prepare data (exclude read-only and hidden fields)
  const transformedData = transformFormData(resource, data, false);

  try {
    const model = resource.model as keyof typeof prisma;
    const modelClient = (prisma as any)[model];

    const record = await modelClient.create({
      data: transformedData,
    });

    return { success: true, data: record };
  } catch (error: any) {
    return {
      success: false,
      errors: [{ message: error.message || "Failed to create record" }],
    };
  }
}

/**
 * Update an existing record
 */
export async function updateRecord(
  resource: AnvilResource,
  id: number | string,
  data: Record<string, any>
): Promise<ActionResult<ResourceRecord>> {
  // Validate
  const errors = validateFormData(resource, data, true);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  // Check unique constraints (excluding current record)
  for (const [fieldName, fieldSchema] of Object.entries(
    resource.editForm.fields
  )) {
    if (fieldSchema.type === "email" || fieldSchema.type === "text") {
      if (fieldSchema.unique && data[fieldName]) {
        const model = resource.model as keyof typeof prisma;
        const modelClient = (prisma as any)[model];

        const existing = await modelClient.findFirst({
          where: {
            [fieldName]: data[fieldName],
            NOT: { id: Number(id) },
          },
        });

        if (existing) {
          return {
            success: false,
            errors: [
              {
                field: fieldName,
                message: `${fieldSchema.label || fieldName} must be unique`,
              },
            ],
          };
        }
      }
    }
  }

  // Transform and prepare data (exclude read-only and hidden fields on update)
  const transformedData = transformFormData(resource, data, true);

  try {
    const model = resource.model as keyof typeof prisma;
    const modelClient = (prisma as any)[model];

    const record = await modelClient.update({
      where: { id: Number(id) },
      data: transformedData,
    });

    return { success: true, data: record };
  } catch (error: any) {
    return {
      success: false,
      errors: [{ message: error.message || "Failed to update record" }],
    };
  }
}

/**
 * Delete a record
 */
export async function deleteRecord(
  resource: AnvilResource,
  id: number | string
): Promise<ActionResult> {
  try {
    const model = resource.model as keyof typeof prisma;
    const modelClient = (prisma as any)[model];

    await modelClient.delete({
      where: { id: Number(id) },
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      errors: [{ message: error.message || "Failed to delete record" }],
    };
  }
}
