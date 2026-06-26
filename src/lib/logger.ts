/**
 * Logger utilities
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
  source?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private isDevelopment: boolean = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, data?: unknown, source?: string): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      source,
    };

    this.logs.push(entry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    if (this.isDevelopment) {
      const prefix = source ? `[${source}]` : "";
      const logFn = console[level] || console.log;

      if (data) {
        logFn(`${prefix} ${message}`, data);
      } else {
        logFn(`${prefix} ${message}`);
      }
    }
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

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter((log) => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogCount(): number {
    return this.logs.length;
  }

  getLogCountByLevel(): Record<LogLevel, number> {
    const counts: Record<LogLevel, number> = {
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
    };

    this.logs.forEach((log) => {
      counts[log.level]++;
    });

    return counts;
  }
}

export const logger = new Logger();

export function createLogger(source: string) {
  return {
    debug: (message: string, data?: unknown) => logger.debug(message, data, source),
    info: (message: string, data?: unknown) => logger.info(message, data, source),
    warn: (message: string, data?: unknown) => logger.warn(message, data, source),
    error: (message: string, data?: unknown) => logger.error(message, data, source),
  };
}
