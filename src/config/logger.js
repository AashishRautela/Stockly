import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors, colorize, json } = format;

const isProduction = process.env.NODE_ENV === 'production';

const myFormat = printf(
  ({ level, message, timestamp, stack, file, ...meta }) => {
    const fileTag = file ? ` [${file}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return stack
      ? `${timestamp} - ${level}:${fileTag} ${message}\n${stack}${metaStr}`
      : `${timestamp} - ${level}:${fileTag} ${message}${metaStr}`;
  }
);

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    isProduction ? json() : combine(colorize(), myFormat)
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combineLogs.log' })
  ]
});

export default logger;
