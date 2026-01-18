/**
 * Centralized Logging Utility
 * 
 * This utility provides controlled logging that can be:
 * - Disabled in production for performance and security
 * - Used consistently across the application
 * - Easily searched/filtered in logs
 */

import { isBrowser } from '@/lib/supabase/client'

// Logging levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// Current logging level - can be set via environment variable
const LOG_LEVEL: LogLevel = process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel || 
  (process.env.NODE_ENV === 'production' ? 'warn' : 'debug')

// Prefix for all logs
const LOG_PREFIX = '[QIS]'

// Level hierarchy for comparison
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

/**
 * Check if a log level should be displayed
 */
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[LOG_LEVEL]
}

/**
 * Format log message with timestamp and context
 */
function formatMessage(level: LogLevel, message: string, context?: string): string {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` [${context}]` : ''
  return `${timestamp} ${LOG_PREFIX} ${level.toUpperCase()}${contextStr}: ${message}`
}

/**
 * Debug level logging - only in development
 */
export function debug(message: string, context?: string): void {
  if (!shouldLog('debug')) return
  
  const formatted = formatMessage('debug', message, context)
  if (isBrowser()) {
    console.debug(formatted)
  } else {
    console.debug(formatted)
  }
}

/**
 * Info level logging - useful for tracking flow
 */
export function info(message: string, context?: string): void {
  if (!shouldLog('info')) return
  
  const formatted = formatMessage('info', message, context)
  if (isBrowser()) {
    console.info(formatted)
  } else {
    console.info(formatted)
  }
}

/**
 * Warning level logging - always shown
 */
export function warn(message: string, context?: string): void {
  if (!shouldLog('warn')) return
  
  const formatted = formatMessage('warn', message, context)
  if (isBrowser()) {
    console.warn(formatted)
  } else {
    console.warn(formatted)
  }
}

/**
 * Error level logging - always shown
 */
export function error(message: string, context?: string, error?: unknown): void {
  if (!shouldLog('error')) return
  
  const formatted = formatMessage('error', message, context)
  if (isBrowser()) {
    console.error(formatted)
    if (error) console.error(error)
  } else {
    console.error(formatted)
    if (error) console.error(error)
  }
}

/**
 * Group related logs together
 */
export function group(label: string): void {
  if (!shouldLog('debug')) return
  console.group(label)
}

export function groupEnd(): void {
  if (!shouldLog('debug')) return
  console.groupEnd()
}

/**
 * Track timing of operations
 */
export function time(label: string): void {
  if (!shouldLog('debug')) return
  console.time(label)
}

export function timeEnd(label: string): void {
  if (!shouldLog('debug')) return
  console.timeEnd(label)
}

// Export the current log level for debugging
export function getLogLevel(): LogLevel {
  return LOG_LEVEL
}

// Convenience exports for specific contexts
export const logger = {
  debug,
  info,
  warn,
  error,
  group,
  groupEnd,
  time,
  timeEnd,
  getLogLevel,
}

export default logger

