/**
 * Centralized Error Handling Utility for API Routes
 */

import { NextResponse, type NextRequest } from 'next/server'

export type ApiErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'DATABASE_ERROR'
  | 'SUPABASE_ERROR'
  | 'CONFIGURATION_ERROR'

export interface ApiError {
  code: ApiErrorCode
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: { timestamp: string }
}

export class ApiException extends Error {
  public readonly code: ApiErrorCode
  public readonly details?: Record<string, unknown>
  public readonly statusCode: number

  constructor(
    code: ApiErrorCode,
    message: string,
    details?: Record<string, unknown>,
    statusCode: number = 500
  ) {
    super(message)
    this.name = 'ApiException'
    this.code = code
    this.details = details
    this.statusCode = statusCode
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string = 'Authentication required') {
    super('UNAUTHORIZED', message, undefined, 401)
  }
}

export class ForbiddenException extends ApiException {
  constructor(message: string = 'Access denied') {
    super('FORBIDDEN', message, undefined, 403)
  }
}

export class ValidationException extends ApiException {
  constructor(message: string, details?: Record<string, unknown>) {
    super('VALIDATION_ERROR', message, details, 400)
  }
}

export function successResponse<T>(data: T, request?: NextRequest): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta: { timestamp: new Date().toISOString() },
  })
}

export function errorResponse(error: Error | ApiException, request?: NextRequest): NextResponse<ApiResponse> {
  const apiError = error instanceof ApiException
    ? { code: error.code, message: error.message, details: error.details }
    : { code: 'SERVER_ERROR' as ApiErrorCode, message: error.message || 'An unexpected error occurred' }

  const statusCode = error instanceof ApiException ? error.statusCode : 500

  return NextResponse.json({
    success: false,
    error: apiError,
    meta: { timestamp: new Date().toISOString() },
  }, { status: statusCode })
}

export function handleSupabaseError(error: unknown, context?: string): ApiException {
  const errorMessage = error instanceof Error ? error.message : 'Unknown database error'
  
  if (errorMessage.includes('JWT expired') || errorMessage.includes('invalid JWT')) {
    return new UnauthorizedException('Session expired. Please sign in again.')
  }
  
  if (errorMessage.includes('row-level security') || errorMessage.includes('RLS')) {
    return new ForbiddenException('You do not have permission to access this resource.')
  }
  
  return new ApiException(
    'DATABASE_ERROR',
    context ? `Database error during ${context}: ${errorMessage}` : `Database error`,
    undefined,
    500
  )
}

export function validateEnv(required: string[]): { valid: boolean; missing: string[] } {
  const missing: string[] = []
  for (const env of required) {
    if (!process.env[env]) {
      missing.push(env)
    }
  }
  return { valid: missing.length === 0, missing }
}

export default {
  ApiException,
  UnauthorizedException,
  ForbiddenException,
  ValidationException,
  successResponse,
  errorResponse,
  handleSupabaseError,
  validateEnv,
}

