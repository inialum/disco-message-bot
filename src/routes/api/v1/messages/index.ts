import { OpenAPIHono } from '@hono/zod-openapi'

import { welcomeApiV1 } from './welcome'

export const messagesApiV1 = new OpenAPIHono()
messagesApiV1.route('/welcome', welcomeApiV1)
