import { OpenAPIHono } from '@hono/zod-openapi'

import { messagesApiV1 } from './messages'

export const apiV1 = new OpenAPIHono()
apiV1.route('/messages', messagesApiV1)
