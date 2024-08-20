import { SafeParseReturnType, ZodTypeAny, ZodObject, ZodRawShape } from "zod";

type FieldErrors = Record<string, string[] | undefined>;

export function validateFormData<T extends ZodTypeAny>(
  schema: T,
  formData: FormData
): { result: SafeParseReturnType<any, T["_output"]>; errors: FieldErrors } {
  let data: Record<string, FormDataEntryValue | null> = {};

  if (schema instanceof ZodObject) {
    data = Object.fromEntries(
      Object.keys(schema.shape as ZodRawShape).map((key) => [
        key,
        formData.get(key),
      ])
    );
  } else {
    for (const [key, value] of Array.from(formData.entries())) {
      data[key] = value;
    }
  }

  const result = schema.safeParse(data);

  const errors: FieldErrors = !result.success
    ? result.error.flatten().fieldErrors
    : {};

  return { result, errors };
}
