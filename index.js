import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
import schedule from 'node-schedule'
import fs from 'fs'
import validator from 'validator'

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

const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0
  } else {
    const radlat1 = (Math.PI * lat1) / 180
    const radlat2 = (Math.PI * lat2) / 180
    const theta = lon1 - lon2
    const radtheta = (Math.PI * theta) / 180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    if (unit === 'K') {
      dist = dist * 1.609344
    }
    if (unit === 'N') {
      dist = dist * 0.8684
    }
    return dist
  }
}

bot.on('message', async event => {
  // 放在外面
  const flex = {
    type: 'carousel',
    contents: []
  }

  let bubbles = []

  if (event.message.type === 'text') {
    const result = data.filter(d => {
      // return d.city === event.message.text && d.limited_time === 'no' && d.socket === 'yes'
      return (d.address.includes(event.message.text) || d.name.includes(event.message.text)) && d.limited_time === 'no' && d.socket === 'yes'
    })
    console.log(result)
    for (const r of result) {
      // 判斷是不是網址
      r.url = validator.isURL(r.url) ? r.url : `http://maps.google.com/?q=${encodeURI(r.latitude)},${encodeURI(r.longitude)}`
      const b = {
        type: 'bubble',
        size: 'micro',
        body: {
          backgroundColor: '#FAF2EB',
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: `${r.name}`,
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
                  text: 'wifi:',
                  size: 'xs',
                  color: '#8c8c8c',
                  flex: 5
                },
                {
                  type: 'text',
                  text: `${r.wifi}`,
                  size: 'xs',
                  color: '#8c8c8c',
                  margin: 'sm',
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
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'seat:',
                  size: 'xs',
                  color: '#8c8c8c',
                  flex: 5
                },
                {
                  type: 'text',
                  text: `${r.seat}`,
                  size: 'xs',
                  color: '#8c8c8c',
                  margin: 'sm',
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
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'quiet:',
                  size: 'xs',
                  color: '#8c8c8c',
                  flex: 5
                },
                {
                  type: 'text',
                  text: `${r.quiet}`,
                  size: 'xs',
                  color: '#8c8c8c',
                  margin: 'sm',
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
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'tasty:',
                  size: 'xs',
                  color: '#8c8c8c',
                  flex: 5
                },
                {
                  type: 'text',
                  text: `${r.tasty}`,
                  size: 'xs',
                  color: '#8c8c8c',
                  margin: 'sm',
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
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'cheap:',
                  size: 'xs',
                  color: '#8c8c8c',
                  flex: 5
                },
                {
                  type: 'text',
                  text: `${r.cheap}`,
                  size: 'xs',
                  color: '#8c8c8c',
                  margin: 'sm',
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
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'music:',
                  size: 'xs',
                  color: '#8c8c8c',
                  flex: 5
                },
                {
                  type: 'text',
                  text: `${r.music}`,
                  size: 'xs',
                  color: '#8c8c8c',
                  margin: 'sm',
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
                      type: 'icon',
                      size: 'xs',
                      url: 'https://image.flaticon.com/icons/png/128/684/684908.png',
                      offsetTop: '1px'
                    },
                    {
                      type: 'text',
                      text: `${r.address}`,
                      wrap: true,
                      color: '#8c8c8c',
                      size: 'xs',
                      action: {
                        type: 'uri',
                        uri: `http://maps.google.com/?q=${encodeURI(r.latitude)},${encodeURI(r.longitude)}`
                      }
                    }
                  ]
                }
              ]
            }
          ],
          spacing: 'sm',
          paddingAll: '13px'
        },
        footer: {
          backgroundColor: '#AB835E',
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              action: {
                type: 'uri',
                label: 'Website',
                uri: `${r.url}`
              },
              style: 'link',
              color: '#FAF2EB'
            }
          ]
        }
      }
      bubbles.push(b)
      // console.log(bubbles.length)
      if (bubbles.length > 6) {
        const arr = []
        for (let i = 1; i <= 6; i++) {
          const index = Math.round(Math.random() * (bubbles.length - 1))
          arr.push(bubbles[index])
          bubbles.splice(index, 1)
          // console.log(index)
        }
        bubbles = arr
        // console.log(bubbles.length) // 5
      }
    }
  } else if (event.message.type === 'location') {
    // const result = data.filter(d => {
    //   const km = distance(event.message.latitude, event.message.longitude, d.latitude, d.longitude)
    //   return
    // })
    for (const d of data) {
      d.url = validator.isURL(d.url) ? d.url : `http://maps.google.com/?q=${encodeURI(d.latitude)},${encodeURI(d.longitude)}`
      const km = distance(d.latitude, d.longitude, event.message.latitude, event.message.longitude)
      if (km <= 1) {
        const b = {
          type: 'bubble',
          size: 'micro',
          body: {
            backgroundColor: '#FAF2EB',
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'text',
                text: `${d.name}`,
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
                    text: 'wifi:',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 5
                  },
                  {
                    type: 'text',
                    text: `${d.wifi}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'sm',
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
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'seat:',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 5
                  },
                  {
                    type: 'text',
                    text: `${d.seat}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'sm',
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
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'quiet:',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 5
                  },
                  {
                    type: 'text',
                    text: `${d.quiet}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'sm',
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
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'tasty:',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 5
                  },
                  {
                    type: 'text',
                    text: `${d.tasty}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'sm',
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
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'cheap:',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 5
                  },
                  {
                    type: 'text',
                    text: `${d.cheap}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'sm',
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
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'music:',
                    size: 'xs',
                    color: '#8c8c8c',
                    flex: 5
                  },
                  {
                    type: 'text',
                    text: `${d.music}`,
                    size: 'xs',
                    color: '#8c8c8c',
                    margin: 'sm',
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
                        type: 'icon',
                        size: 'xs',
                        url: 'https://image.flaticon.com/icons/png/128/684/684908.png',
                        offsetTop: '1px'
                      },
                      {
                        type: 'text',
                        text: `${d.address}`,
                        wrap: true,
                        color: '#8c8c8c',
                        size: 'xs',
                        action: {
                          type: 'uri',
                          uri: `http://maps.google.com/?q=${encodeURI(d.latitude)},${encodeURI(d.longitude)}`
                        }
                      }
                    ]
                  }
                ]
              }
            ],
            spacing: 'sm',
            paddingAll: '13px'
          },
          footer: {
            backgroundColor: '#AB835E',
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'uri',
                  label: 'Website',
                  uri: `${d.url}`
                },
                style: 'link',
                color: '#FAF2EB'
              }
            ]
          }
        }
        bubbles.push(b)
      }
    }
  }

  // 放在外面
  flex.contents = bubbles
  console.log(flex.contents[0].body)
  const message = {
    type: 'flex',
    altText: '今天要選哪一間咖啡廳呢？',
    contents: flex
  }
  event.reply(message)
  fs.writeFileSync('aaa.json', JSON.stringify(message, null, 2))
})
