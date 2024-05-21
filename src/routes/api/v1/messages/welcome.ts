import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { env } from 'hono/adapter'

import { buildDiscordMessageBody } from '@/libs/api/v1/messages/welcome'
import {
  WelcomeMessageApi400ErrorSchemaV1,
  WelcomeMessageApi500ErrorSchemaV1,
  WelcomeMessageApiRequestSchemaV1,
  WelcomeMessageApiResponseSchemaV1,
} from '@/libs/api/v1/schema/welcomeMessage'

const welcomeApiV1 = new OpenAPIHono()

const route = createRoute({
  method: 'post',
  path: '',
  security: [{ Bearer: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: WelcomeMessageApiRequestSchemaV1,
        },
      },
      description: 'Message to send to Discord',
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: WelcomeMessageApiResponseSchemaV1,
        },
      },
      description: 'Returns OK response if the notification is successful',
    },
    400: {
      content: {
        'application/json': {
          schema: WelcomeMessageApi400ErrorSchemaV1,
        },
      },
      description: 'Bad request',
    },
    500: {
      content: {
        'application/json': {
          schema: WelcomeMessageApi500ErrorSchemaV1,
        },
      },
      description: 'Internal server error or external API error',
    },
  },
})

welcomeApiV1.openapi(
  route,
  async (c) => {
    const { DISCORD_WEBHOOK_URL } = env<{ DISCORD_WEBHOOK_URL: string }>(c)

    const data = c.req.valid('json')

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: buildDiscordMessageBody(data),
      })
      if (response.ok) {
        return c.json({
          status: 'ok',
        })
      } else {
        const error = await response.text()
        throw new Error(error)
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e)

        return c.json(
          {
            message: e.message,
          },
          500,
        )
      }
      return c.json(
        {
          message: 'Internal Server Error',
        },
        500,
      )
    }
  },
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: 'Invalid request body',
          issues: result.error.issues,
        },
        400,
      )
    }
  },
)

export { welcomeApiV1 }
