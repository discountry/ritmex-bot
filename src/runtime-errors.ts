import { extractMessage } from './utils/errors';

declare const Bun: { on?: (event: string, listener: (payload: any) => void) => void } | undefined;

type Handler = (error: unknown) => void;

let installed = false;
const lastLogAt = new Map<string, number>();

function logRuntimeIssue(kind: string, error: unknown): void {
   const message = extractMessage(error);
   const now = Date.now();
   const key = `${kind}:${message}`;
   const previous = lastLogAt.get(key) ?? 0;
   if (now - previous < 1000) { return; }
   lastLogAt.set(key, now);
   console.error(`[RuntimeGuard] ${kind}: ${message}`);
   if (error instanceof Error && error.stack) {
      console.error(error.stack);
   }
}

function bindProcessEvent(event: string, handler: Handler): void {
   if (typeof process === 'undefined' || typeof process.on !== 'function') { return; }
   process.on(event as any, (error: unknown) => {
      try {
         handler(error);
      } catch (loggingError) {
         console.error(`[RuntimeGuard] Failed to log ${event}:`, loggingError);
      }
   });
}

export function setupGlobalErrorHandlers(): void {
   if (installed) { return; }
   installed = true;

   bindProcessEvent('uncaughtException', (error) => {
      logRuntimeIssue('uncaughtException', error);
   });

   bindProcessEvent('unhandledRejection', (reason) => {
      logRuntimeIssue('unhandledRejection', reason);
   });

   bindProcessEvent('multipleResolves', (payload) => {
      logRuntimeIssue('multipleResolves', payload);
   });

   const globalWithEvents = globalThis as unknown as { addEventListener?: (type: string, listener: (event: any) => void) => void };

   if (typeof globalWithEvents.addEventListener === 'function') {
      try {
         globalWithEvents.addEventListener('unhandledrejection', (event: any) => {
            logRuntimeIssue('unhandledRejection', event?.reason);
            if (event && typeof event.preventDefault === 'function') {
               event.preventDefault();
            }
         });
         globalWithEvents.addEventListener('error', (event: any) => {
            logRuntimeIssue('unhandledError', event?.error ?? event);
            if (event && typeof event.preventDefault === 'function') {
               event.preventDefault();
            }
         });
      } catch (handlerError) {
         console.error('[RuntimeGuard] Failed to bind global listeners', handlerError);
      }
   }

   if (typeof Bun !== 'undefined' && typeof Bun?.on === 'function') {
      try {
         Bun.on('unhandledRejection', (reason: unknown) => {
            logRuntimeIssue('bun.unhandledRejection', reason);
         });
         Bun.on('error', (error: unknown) => {
            logRuntimeIssue('bun.error', error);
         });
      } catch (bunHandlerError) {
         console.error('[RuntimeGuard] Failed to bind Bun listeners', bunHandlerError);
      }
   }
}
