import "colors";

class Logger {
    info(message: string): void {
        console.log("[INFO]".cyan, message);
    }

    warn(message: string): void {
        console.log("[WARN]".yellow, message);
    }

    error(message: string, error?: unknown): void {
        console.error("[ERROR]".red, message);

        if (error instanceof Error) {
            console.error(error.stack);
        }
    }
}

export default Logger;