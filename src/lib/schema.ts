/**
 * Schema utilities
 */

interface SchemaField {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  required?: boolean;
  default?: unknown;
  validate?: (value: unknown) => boolean;
}

interface Schema {
  name: string;
  version: string;
  fields: SchemaField[];
}

class SchemaManager {
  private schemas: Map<string, Schema> = new Map();

  register(schema: Schema): void {
    this.schemas.set(schema.name, schema);
  }

  unregister(name: string): void {
    this.schemas.delete(name);
  }

  getSchema(name: string): Schema | undefined {
    return this.schemas.get(name);
  }

  getAllSchemas(): Schema[] {
    return Array.from(this.schemas.values());
  }

  validate(name: string, data: unknown): { valid: boolean; errors: string[] } {
    const schema = this.schemas.get(name);
    if (!schema) {
      return { valid: false, errors: [`Schema "${name}" not found`] };
    }

    const errors: string[] = [];
    const obj = data as Record<string, unknown>;

    for (const field of schema.fields) {
      const value = obj[field.name];

      // Check required
      if (field.required && (value === undefined || value === null)) {
        errors.push(`Field "${field.name}" is required`);
        continue;
      }

      // Skip if not present and not required
      if (value === undefined || value === null) continue;

      // Check type
      if (!this.checkType(value, field.type)) {
        errors.push(`Field "${field.name}" must be of type ${field.type}`);
        continue;
      }

      // Custom validation
      if (field.validate && !field.validate(value)) {
        errors.push(`Field "${field.name}" failed validation`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private checkType(value: unknown, type: SchemaField["type"]): boolean {
    switch (type) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      case "array":
        return Array.isArray(value);
      case "object":
        return typeof value === "object" && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }

  applyDefaults(name: string, data: Record<string, unknown>): Record<string, unknown> {
    const schema = this.schemas.get(name);
    if (!schema) return data;

    const result = { ...data };

    for (const field of schema.fields) {
      if (result[field.name] === undefined && field.default !== undefined) {
        result[field.name] = field.default;
      }
    }

    return result;
  }

  clear(): void {
    this.schemas.clear();
  }
}

export function createSchemaManager(): SchemaManager {
  return new SchemaManager();
}

export function createSchema(
  name: string,
  version: string,
  fields: SchemaField[]
): Schema {
  return { name, version, fields };
}

export function createSchemaField(
  name: string,
  type: SchemaField["type"],
  options?: Partial<Omit<SchemaField, "name" | "type">>
): SchemaField {
  return { name, type, ...options };
}

// Global schema manager
let globalSchemaManager: SchemaManager | null = null;

export function getGlobalSchemaManager(): SchemaManager {
  if (!globalSchemaManager) {
    globalSchemaManager = createSchemaManager();
  }
  return globalSchemaManager;
}

export function setGlobalSchemaManager(manager: SchemaManager): void {
  globalSchemaManager = manager;
}

// Convenience functions
export function registerSchema(schema: Schema): void {
  getGlobalSchemaManager().register(schema);
}

export function validateSchema(name: string, data: unknown): { valid: boolean; errors: string[] } {
  return getGlobalSchemaManager().validate(name, data);
}

export function applySchemaDefaults(name: string, data: Record<string, unknown>): Record<string, unknown> {
  return getGlobalSchemaManager().applyDefaults(name, data);
}

export function getSchema(name: string): Schema | undefined {
  return getGlobalSchemaManager().getSchema(name);
}

export function getAllSchemas(): Schema[] {
  return getGlobalSchemaManager().getAllSchemas();
}

export function clearSchemas(): void {
  getGlobalSchemaManager().clear();
}
