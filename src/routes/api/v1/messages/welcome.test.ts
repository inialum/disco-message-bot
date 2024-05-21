import { type ZodError } from 'zod'

import { type WelcomeMessageApiRequestV1 } from '@/libs/api/v1/schema/welcomeMessage'

import { messagesApiV1 } from '.'

vi.mock('hono/adapter', () => {
  return {
    env: () => getMiniflareBindings(),
  }
})

describe('API v1', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'ok',
        }),
      ),
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const apiBodyContent = {
    title: '入会者通知',
    name: 'John Doe',
    email: 'john@example.com',
    student_id: '123456',
  } satisfies WelcomeMessageApiRequestV1

  test('POST /notify (should return data with no errors)', async () => {
    const res = await messagesApiV1.request('/welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiBodyContent),
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      status: 'ok',
    })
  })

  test('POST /welcome (should return with error message)', async () => {
    const res = await messagesApiV1.request('/welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '入会者通知',
        email: 'john@example.com',
      }),
    })

    expect(res.status).toBe(400)
    expect(await res.json()).toStrictEqual({
      message: 'Invalid request body',
      issues: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['name'],
          received: 'undefined',
        },
      ] as ZodError['issues'],
    })
  })
})
