import winston, { format } from "winston";

/**
 * @module Logger
 * @description Configures and exports a Winston logger for application-wide logging.
 */

const { combine, timestamp, label, printf } = format;

/**
 * Custom logging format that includes timestamp, label, log level, and message or stack trace.
 * @type {winston.Logform.Format}
 */
const loggingFormat: winston.Logform.Format = printf(
  ({ level, message, label, timestamp, stack }) => {
    return `${timestamp} [${label}] ${level}: ${stack || message}`;
  },
);

/**
 * Timestamp format for log entries.
 * @type {string}
 */
const timestampFormat: string = "YYYY-MM-DD HH:mm:ss";

/**
 * Color configuration for different log levels.
 * @type {Object.<string, string>}
 */
const colors: Record<string, string> = {
  info: "bold green",
  error: "bold red",
  warn: "bold yellow",
  debug: "bold magenta",
  http: "bold blue",
};

/**
 * Winston logger instance configured for console output with custom formatting.
 * @type {winston.Logger}
 */
const logger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",
  format: combine(
    format.colorize({ colors }),
    label({ label: " backend " }),
    timestamp({ format: timestampFormat }),
    format.errors({ stack: true }),
    loggingFormat,
  ),
  transports: [new winston.transports.Console()],
});

//TODO: Add file transport for production and log rotation for later analysis

export default logger;
