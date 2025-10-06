export function isUnknownOrderError(error: unknown): boolean {
   const message = extractMessage(error);
   if (!message) { return false; }
   return message.includes('Unknown order') || message.includes('code":-2011');
}

export function extractMessage(error: unknown): string {
   if (typeof error === 'string') { return error; }
   if (error instanceof Error) { return error.message; }
   try {
      return JSON.stringify(error);
   } catch {
      return String(error);
   }
}

export function isRateLimitError(error: unknown): boolean {
   if (!error) { return false; }
   if (typeof error === 'object' && 'status' in error) {
      const status = Number((error as { status?: unknown }).status);
      if (Number.isFinite(status) && status === 429) {
         return true;
      }
   }
   if (typeof error === 'object' && 'code' in error) {
      const code = (error as { code?: unknown }).code;
      if (code === 429 || code === '429') {
         return true;
      }
   }
   const message = extractMessage(error).toLowerCase();
   return (message.includes('429') || message.includes('too many requests') || message.includes('rate limit') || message.includes('request rate'));
}
