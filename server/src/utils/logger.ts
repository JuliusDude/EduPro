/**
 * Simple logger utility
 */

enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG',
}

class Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private log(level: LogLevel, message: string, ...args: any[]): void {
        const timestamp = this.getTimestamp();
        const prefix = `[${timestamp}] [${level}]`;

        switch (level) {
            case LogLevel.ERROR:
                console.error(prefix, message, ...args);
                break;
            case LogLevel.WARN:
                console.warn(prefix, message, ...args);
                break;
            case LogLevel.DEBUG:
                if (process.env.NODE_ENV === 'development') {
                    console.debug(prefix, message, ...args);
                }
                break;
            default:
                console.log(prefix, message, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        this.log(LogLevel.INFO, message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        this.log(LogLevel.WARN, message, ...args);
    }

    error(message: string, ...args: any[]): void {
        this.log(LogLevel.ERROR, message, ...args);
    }

    debug(message: string, ...args: any[]): void {
        this.log(LogLevel.DEBUG, message, ...args);
    }
}

export default new Logger();
