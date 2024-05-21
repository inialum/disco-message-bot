import { type APIEmbed } from 'discord-api-types/v10'

import { type WelcomeMessageApiRequestV1 } from '@/libs/api/v1/schema/welcomeMessage'

export const buildDiscordMessageBody = (data: WelcomeMessageApiRequestV1) => {
  const bodyObject = {
    username: '入会通知',
    embeds: [
      {
        title: data.title,
        color: 0x00b0eb,
        fields: [
          {
            name: '氏名',
            value: data.name,
          },
          {
            name: 'メールアドレス',
            value: data.email,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ] satisfies APIEmbed[],
  }

  if (data.student_id) {
    bodyObject.embeds[0].fields.push({
      name: '学籍番号',
      value: data.student_id,
    })
  }

  return JSON.stringify(bodyObject)
}
