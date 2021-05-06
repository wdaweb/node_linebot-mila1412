import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import schedule from 'node-schedule'
import fs from 'fs'

let data = []

const getData = () => {
  axios
    .get('https://cafenomad.tw/api/v1.2/cafes')
    .then(response => {
      data = response.data
    })
    .catch()
}

// 每天 0 點更新資料
schedule.scheduleJob('* * 0 * *', getData)
// 機器人啟動時也要有資料
getData()

dotenv.config()

const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    const result = data.filter(d => {
      return d.city === event.message.text
    })
    const flex = {
      type: 'carousel',
      contents: [
        {
          type: 'bubble',
          size: 'micro',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Brown Cafe',
                weight: 'bold',
                size: 'sm',
                wrap: true
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: '4.0',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 0
                  },
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                    margin: 'xs',
                    offsetTop: '1px'
                  }
                ]
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: `${result[0].address}`,
                        wrap: true,
                        color: '#8c8c8c',
                        size: 'xs',
                        flex: 5,
                        action: {
                          type: 'uri',
                          label: '123',
                          uri: `http://maps.google.com/?q=${encodeURI(result[0].latitude)},${encodeURI(result[0].longitude)}`
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          }
        },
        {
          type: 'bubble',
          size: 'micro',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: "Brow&Cony's Restaurant",
                weight: 'bold',
                size: 'sm',
                wrap: true
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: '4.0',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 0
                  },
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                    margin: 'xs',
                    offsetTop: '1px'
                  }
                ]
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: `${result[1].address}`,
                        wrap: true,
                        color: '#8c8c8c',
                        size: 'xs',
                        flex: 5,
                        action: {
                          type: 'uri',
                          label: '123',
                          uri: `http://maps.google.com/?q=${encodeURI(result[1].latitude)},${encodeURI(result[1].longitude)}`
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          }
        },
        {
          type: 'bubble',
          size: 'micro',
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: 'Tata',
                weight: 'bold',
                size: 'sm'
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: '4.0',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 0
                  },
                  {
                    type: 'icon',
                    size: 'xs',
                    url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png',
                    margin: 'xs',
                    offsetTop: '1px'
                  }
                ]
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'box',
                    layout: 'baseline',
                    spacing: 'sm',
                    contents: [
                      {
                        type: 'text',
                        text: `${result[2].address}`,
                        wrap: true,
                        color: '#8c8c8c',
                        size: 'xs',
                        flex: 5,
                        action: {
                          type: 'uri',
                          label: '123',
                          uri: `http://maps.google.com/?q=${encodeURI(result[2].latitude)},${encodeURI(result[2].longitude)}`
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          }
        }
      ]
    }
    const message = {
      type: 'flex',
      altText: '這是 flex',
      contents: flex
    }
    fs.writeFileSync('aaa.json', JSON.stringify(message, null, 2))
    event.reply(message)
  }
})

//  {
//         type: 'location',
//         title: result[0].name,
//         address: result[0].address,
//         latitude: result[0].latitude,
//         longitude: result[0].longitude
//       },
//       {
//         type: 'location',
//         title: result[1].name,
//         address: result[1].address,
//         latitude: result[1].latitude,
//         longitude: result[1].longitude
//       },
//       {
//         type: 'location',
//         title: result[2].name,
//         address: result[2].address,
//         latitude: result[2].latitude,
//         longitude: result[2].longitude
//       },
//       {
//         type: 'location',
//         title: result[3].name,
//         address: result[3].address,
//         latitude: result[3].latitude,
//         longitude: result[3].longitude
//       }

// for (const r of result) {
//   console.log(r)
// }
// let name = ''
// let address = ''
// let latitude = ''
// let longitude = ''
// result.forEach(function (item, index) {
//   console.log(index)
//   name += item.name
//   address += item.address
//   latitude += item.latitude
//   longitude += item.longitude
// })

// flex
// event.reply({
//   type: 'flex',
//   altText: '這是flex',
//   contents: {
//     type: 'carousel',
//     contents: [flex]
//   }
// })

// fs
// bot.on('message', async event => {
//   if (event.message.type === 'text') {
//     const message = {
//       type: 'flex',
//       altText: '這是 flex',
//       contents: {
//         type: 'carousel',
//         contents: [flex]
//       }
//     }

//     fs.writeFileSync('aaa.json', JSON.stringify(message, null, 2))
//     event.reply(message)
//   }
// })
