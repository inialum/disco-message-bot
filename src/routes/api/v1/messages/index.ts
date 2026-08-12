import { OpenAPIHono } from '@hono/zod-openapi'

import { welcomeApiV1 } from './welcome'
import type { Bindings } from '@/types'

export const messagesApiV1 = new OpenAPIHono<{ Bindings: Bindings }>()
messagesApiV1.route('/welcome', welcomeApiV1)
