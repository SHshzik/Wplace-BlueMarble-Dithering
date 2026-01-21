export type LogMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface LoggerOptions {
  separator?: string;
  enabled?: boolean;
}

export default class Logger {
  private readonly prefixes: readonly string[];
  private readonly separator: string;
  private enabled: boolean;

  constructor(
    prefixes: readonly string[] = [],
    options: LoggerOptions = {}
  ) {
    this.prefixes = prefixes;
    this.separator = options.separator ?? ' | ';
    this.enabled = options.enabled ?? true;
  }

  /** Создаёт вложенный логгер */
  child(...newPrefixes: string[]): Logger {
    return new Logger(
      [...this.prefixes, ...newPrefixes],
      {
        separator: this.separator,
        enabled: this.enabled
      }
    );
  }

  setEnabled(value: boolean): this {
    this.enabled = value;
    return this;
  }

  // ---------------- private ----------------

  private formatPrefix(): string {
    if (this.prefixes.length === 0) {
      return '';
    }
    return `[${ this.prefixes.join(this.separator) }]`;
  }

  private write(method: LogMethod, args: unknown[]): void {
    if (!this.enabled) return;

    const prefix = this.formatPrefix();

    if (prefix) {
      console[method](prefix, ...args);
    } else {
      console[method](...args);
    }
  }

  // ---------------- public API ----------------

  log(...args: unknown[]): void {
    this.write('log', args);
  }

  info(...args: unknown[]): void {
    this.write('info', args);
  }

  warn(...args: unknown[]): void {
    this.write('warn', args);
  }

  error(...args: unknown[]): void {
    this.write('error', args);
  }

  debug(...args: unknown[]): void {
    this.write('debug', args);
  }
}
