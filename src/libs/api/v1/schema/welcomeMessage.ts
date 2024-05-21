import { z } from '@hono/zod-openapi'

/**
 * Schema for request of POST /messages/welcome
 */
export const WelcomeMessageApiRequestSchemaV1 = z
  .object({
    title: z
      .string({
        required_error: 'This field is required',
      })
      .max(128, {
        message: 'Message is too long. Max length is 128 characters',
      })
      .openapi({
        example: 'API Error',
      }),
    name: z
      .string()
      .max(256, {
        message: 'Message is too long. Max length is 256 characters',
      })
      .openapi({
        example: 'API Error',
      }),
    email: z
      .string()
      .email({
        message: 'Invalid email format',
      })
      .openapi({
        example: 'API Error',
      }),
    student_id: z
      .string()
      .max(256, {
        message: 'Message is too long. Max length is 256 characters',
      })
      .optional()
      .openapi({
        example: 'API Error',
      }),
  })
  .openapi('Request')

export type WelcomeMessageApiRequestV1 = z.infer<
  typeof WelcomeMessageApiRequestSchemaV1
>

/**
 * Schema for response of POST /messages/welcome
 */
export const WelcomeMessageApiResponseSchemaV1 = z
  .object({
    status: z.string().openapi({
      example: 'ok',
    }),
  })
  .openapi('Response')

/**
 * Schema for Zod validation error
 */
const ZodValidationError = z.object({
  code: z.string(),
  expected: z.string(),
  received: z.string(),
  path: z.string().array(),
  message: z.string(),
})

/**
 * Schema for 400 error response of POST /messages/welcome
 */
export const WelcomeMessageApi400ErrorSchemaV1 = z.object({
  message: z.string().openapi({
    example: 'Invalid request body',
  }),
  issues: ZodValidationError.array().openapi({
    example: [
      {
        code: 'invalid_string',
        expected: 'string',
        received: 'undefined',
        path: ['message'],
        message: 'This field is required',
      },
    ],
  }),
})

/**
 * Schema for 500 error response of POST /messages/welcome
 */
export const WelcomeMessageApi500ErrorSchemaV1 = z.object({
  message: z.string().openapi({
    example: 'Failed to notify error',
  }),
})
