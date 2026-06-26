/**
 * Builder pattern utilities
 */

export class RequestBuilder {
  private url: string = "";
  private method: string = "GET";
  private headers: Record<string, string> = {};
  private body: unknown = null;
  private timeout: number = 10000;

  setUrl(url: string): this {
    this.url = url;
    return this;
  }

  setMethod(method: "GET" | "POST" | "PUT" | "DELETE"): this {
    this.method = method;
    return this;
  }

  setHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  setBody(body: unknown): this {
    this.body = body;
    return this;
  }

  setTimeout(timeout: number): this {
    this.timeout = timeout;
    return this;
  }

  build(): { url: string; method: string; headers: Record<string, string>; body: unknown; timeout: number } {
    return {
      url: this.url,
      method: this.method,
      headers: { ...this.headers },
      body: this.body,
      timeout: this.timeout,
    };
  }

  async execute<T>(): Promise<T> {
    const config = this.build();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(config.url, {
        method: config.method,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
}

export function createRequest(): RequestBuilder {
  return new RequestBuilder();
}

export class QueryBuilder {
  private conditions: string[] = [];
  private orderByField: string = "";
  private orderDirection: "asc" | "desc" = "asc";
  private limitValue: number = 100;
  private offsetValue: number = 0;

  where(field: string, operator: string, value: unknown): this {
    this.conditions.push(`${field} ${operator} ${JSON.stringify(value)}`);
    return this;
  }

  orderBy(field: string, direction: "asc" | "desc" = "asc"): this {
    this.orderByField = field;
    this.orderDirection = direction;
    return this;
  }

  limit(limit: number): this {
    this.limitValue = limit;
    return this;
  }

  offset(offset: number): this {
    this.offsetValue = offset;
    return this;
  }

  build(): { where: string[]; orderBy: string; limit: number; offset: number } {
    return {
      where: [...this.conditions],
      orderBy: this.orderByField ? `${this.orderByField} ${this.orderDirection}` : "",
      limit: this.limitValue,
      offset: this.offsetValue,
    };
  }

  toQueryString(): string {
    const params = new URLSearchParams();

    if (this.conditions.length > 0) {
      params.set("where", this.conditions.join(" AND "));
    }

    if (this.orderByField) {
      params.set("orderBy", `${this.orderByField} ${this.orderDirection}`);
    }

    params.set("limit", String(this.limitValue));
    params.set("offset", String(this.offsetValue));

    return params.toString();
  }
}

export function createQuery(): QueryBuilder {
  return new QueryBuilder();
}

export class FormBuilder {
  private fields: Map<string, { value: unknown; type: string; required: boolean }> = new Map();

  addField(name: string, value: unknown, type: string = "text", required: boolean = false): this {
    this.fields.set(name, { value, type, required });
    return this;
  }

  setFieldValue(name: string, value: unknown): this {
    const field = this.fields.get(name);
    if (field) {
      field.value = value;
    }
    return this;
  }

  build(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    this.fields.forEach((field, name) => {
      result[name] = field.value;
    });
    return result;
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    this.fields.forEach((field, name) => {
      if (field.required && (field.value === undefined || field.value === null || field.value === "")) {
        errors.push(`${name} is required`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    this.fields.forEach((field, name) => {
      if (field.value !== undefined && field.value !== null) {
        formData.append(name, String(field.value));
      }
    });
    return formData;
  }
}

export function createForm(): FormBuilder {
  return new FormBuilder();
}
