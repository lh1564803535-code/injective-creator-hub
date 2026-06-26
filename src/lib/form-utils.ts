/**
 * Form utilities
 */

export interface FormField {
  name: string;
  value: string;
  error?: string;
  touched?: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  isValid: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export function createFormField(name: string, value: string = ""): FormField {
  return { name, value, error: undefined, touched: false };
}

export function createFormState(fields: Record<string, string>): FormState {
  const formFields: Record<string, FormField> = {};
  Object.entries(fields).forEach(([name, value]) => {
    formFields[name] = createFormField(name, value);
  });

  return {
    fields: formFields,
    isValid: false,
    isSubmitting: false,
    isSubmitted: false,
  };
}

export function updateFormField(
  state: FormState,
  name: string,
  value: string,
  validator?: (value: string) => string | undefined
): FormState {
  const field = state.fields[name];
  if (!field) return state;

  const error = validator ? validator(value) : undefined;

  return {
    ...state,
    fields: {
      ...state.fields,
      [name]: {
        ...field,
        value,
        error,
        touched: true,
      },
    },
    isValid: Object.values(state.fields).every(
      (f) => f.name === name ? !error : !f.error
    ),
  };
}

export function touchAllFields(state: FormState): FormState {
  const fields: Record<string, FormField> = {};
  Object.entries(state.fields).forEach(([name, field]) => {
    fields[name] = { ...field, touched: true };
  });

  return { ...state, fields };
}

export function resetForm(state: FormState): FormState {
  const fields: Record<string, FormField> = {};
  Object.entries(state.fields).forEach(([name, field]) => {
    fields[name] = { ...field, value: "", error: undefined, touched: false };
  });

  return {
    fields,
    isValid: false,
    isSubmitting: false,
    isSubmitted: false,
  };
}

export function getFormValues(state: FormState): Record<string, string> {
  const values: Record<string, string> = {};
  Object.entries(state.fields).forEach(([name, field]) => {
    values[name] = field.value;
  });
  return values;
}

export function getFormErrors(state: FormState): Record<string, string> {
  const errors: Record<string, string> = {};
  Object.entries(state.fields).forEach(([name, field]) => {
    if (field.error && field.touched) {
      errors[name] = field.error;
    }
  });
  return errors;
}

// Common validators
export function required(value: string): string | undefined {
  return value.trim() ? undefined : "This field is required";
}

export function minLength(min: number) {
  return (value: string): string | undefined => {
    return value.length >= min ? undefined : `Must be at least ${min} characters`;
  };
}

export function maxLength(max: number) {
  return (value: string): string | undefined => {
    return value.length <= max ? undefined : `Must be at most ${max} characters`;
  };
}

export function email(value: string): string | undefined {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? undefined : "Invalid email address";
}

export function url(value: string): string | undefined {
  try {
    new URL(value);
    return undefined;
  } catch {
    return "Invalid URL";
  }
}

export function pattern(regex: RegExp, message: string) {
  return (value: string): string | undefined => {
    return regex.test(value) ? undefined : message;
  };
}
