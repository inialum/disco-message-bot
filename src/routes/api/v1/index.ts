import { OpenAPIHono } from '@hono/zod-openapi'

import { messagesApiV1 } from './messages'
import type { Bindings } from '@/types'

export const apiV1 = new OpenAPIHono<{ Bindings: Bindings }>()
apiV1.route('/messages', messagesApiV1)
