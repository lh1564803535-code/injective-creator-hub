/**
 * Logging utilities
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
  source?: string;
}

class Logger {
  private entries: LogEntry[] = [];
  private minLevel: LogLevel;
  private maxEntries: number;

  constructor(minLevel: LogLevel = "info", maxEntries: number = 1000) {
    this.minLevel = minLevel;
    this.maxEntries = maxEntries;
  }

  debug(message: string, data?: unknown, source?: string): void {
    this.log("debug", message, data, source);
  }

  info(message: string, data?: unknown, source?: string): void {
    this.log("info", message, data, source);
  }

  warn(message: string, data?: unknown, source?: string): void {
    this.log("warn", message, data, source);
  }

  error(message: string, data?: unknown, source?: string): void {
    this.log("error", message, data, source);
  }

  private log(level: LogLevel, message: string, data?: unknown, source?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      source,
    };

    this.entries.push(entry);

    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    // Console output in development
    if (process.env.NODE_ENV === "development") {
      const prefix = source ? `[${source}]` : "";
      const logFn = level === "debug" ? console.debug :
                    level === "info" ? console.info :
                    level === "warn" ? console.warn :
                    console.error;

      logFn(`${prefix} ${message}`, data || "");
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  getEntries(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.entries.filter((e) => e.level === level);
    }
    return [...this.entries];
  }

  getEntriesBySource(source: string): LogEntry[] {
    return this.entries.filter((e) => e.source === source);
  }

  clear(): void {
    this.entries = [];
  }

  getStats(): Record<LogLevel, number> {
    return {
      debug: this.entries.filter((e) => e.level === "debug").length,
      info: this.entries.filter((e) => e.level === "info").length,
      warn: this.entries.filter((e) => e.level === "warn").length,
      error: this.entries.filter((e) => e.level === "error").length,
    };
  }
}

export function createLogger(minLevel?: LogLevel, maxEntries?: number): Logger {
  return new Logger(minLevel, maxEntries);
}

// Global logger
let globalLogger: Logger | null = null;

export function getGlobalLogger(): Logger {
  if (!globalLogger) {
    globalLogger = createLogger(process.env.NODE_ENV === "development" ? "debug" : "info");
  }
  return globalLogger;
}

export function setGlobalLogger(logger: Logger): void {
  globalLogger = logger;
}

// Convenience functions
export function logDebug(message: string, data?: unknown, source?: string): void {
  getGlobalLogger().debug(message, data, source);
}

export function logInfo(message: string, data?: unknown, source?: string): void {
  getGlobalLogger().info(message, data, source);
}

export function logWarn(message: string, data?: unknown, source?: string): void {
  getGlobalLogger().warn(message, data, source);
}

export function logError(message: string, data?: unknown, source?: string): void {
  getGlobalLogger().error(message, data, source);
}

export function getLogEntries(level?: LogLevel): LogEntry[] {
  return getGlobalLogger().getEntries(level);
}

export function clearLogs(): void {
  getGlobalLogger().clear();
}

export function getLogStats(): Record<LogLevel, number> {
  return getGlobalLogger().getStats();
}
