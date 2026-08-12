import { OpenAPIHono } from '@hono/zod-openapi'

import { apiV1 } from './v1'
import type { Bindings } from '@/types'

export const api = new OpenAPIHono<{ Bindings: Bindings }>()
api.route('/v1', apiV1)
