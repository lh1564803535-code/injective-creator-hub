/**
 * Config utilities
 */

interface ConfigSchema {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object" | "array";
    default: unknown;
    required?: boolean;
    validate?: (value: unknown) => boolean;
  };
}

class ConfigManager {
  private config: Record<string, unknown> = {};
  private schema: ConfigSchema;

  constructor(schema: ConfigSchema) {
    this.schema = schema;

    // Apply defaults
    for (const [key, definition] of Object.entries(schema)) {
      this.config[key] = definition.default;
    }
  }

  get<T>(key: string): T {
    return this.config[key] as T;
  }

  set(key: string, value: unknown): void {
    const definition = this.schema[key];
    if (!definition) {
      throw new Error(`Unknown config key: ${key}`);
    }

    // Type check
    if (!this.checkType(value, definition.type)) {
      throw new Error(`Invalid type for ${key}: expected ${definition.type}, got ${typeof value}`);
    }

    // Custom validation
    if (definition.validate && !definition.validate(value)) {
      throw new Error(`Validation failed for ${key}`);
    }

    this.config[key] = value;
  }

  getAll(): Record<string, unknown> {
    return { ...this.config };
  }

  reset(): void {
    for (const [key, definition] of Object.entries(this.schema)) {
      this.config[key] = definition.default;
    }
  }

  private checkType(value: unknown, type: string): boolean {
    switch (type) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      case "object":
        return typeof value === "object" && value !== null && !Array.isArray(value);
      case "array":
        return Array.isArray(value);
      default:
        return true;
    }
  }
}

export function createConfigManager(schema: ConfigSchema): ConfigManager {
  return new ConfigManager(schema);
}

// Global config manager
let globalConfigManager: ConfigManager | null = null;

export function getGlobalConfigManager(): ConfigManager {
  if (!globalConfigManager) {
    globalConfigManager = new ConfigManager({});
  }
  return globalConfigManager;
}

export function setGlobalConfigManager(manager: ConfigManager): void {
  globalConfigManager = manager;
}

// Convenience functions
export function getConfig<T>(key: string): T {
  return getGlobalConfigManager().get<T>(key);
}

export function setConfig(key: string, value: unknown): void {
  getGlobalConfigManager().set(key, value);
}

export function getAllConfig(): Record<string, unknown> {
  return getGlobalConfigManager().getAll();
}

export function resetConfig(): void {
  getGlobalConfigManager().reset();
}

// Common config schemas
export const APP_CONFIG_SCHEMA: ConfigSchema = {
  appName: { type: "string", default: "Injective Creator Hub" },
  version: { type: "string", default: "1.0.0" },
  environment: { type: "string", default: "development" },
  apiUrl: { type: "string", default: "" },
  chainId: { type: "number", default: 1439 },
  theme: { type: "string", default: "dark" },
  language: { type: "string", default: "zh" },
  debug: { type: "boolean", default: false },
};

export function createAppConfig(): ConfigManager {
  return createConfigManager(APP_CONFIG_SCHEMA);
}
