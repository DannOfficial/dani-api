const axios = require('axios')

// Yanz & Danz
async function GPT(text) {
  return new Promise(async (resolve, reject) => {
    axios("https://www.chatgptdownload.org/wp-json/mwai-ui/v1/chats/submit", {
      "headers": {
        "content-type": "application/json",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
      },
      data: {
        "id": null,
        "botId": "default",
        "session": "y2cog0j45q",
        "clientId": "7tzjniqtrgx",
        "contextId": 443,
        "messages": [{
          "id": "fkzhaikd7vh",
          "role": "assistant",
          "content": "Danz adalah seorang Pengembang bot WhatsApp, Danz dulu dikenal sebagai Programmer, dan ia ikut oleh team Cyber Security Networking. Danz berasal dari Kalimantan.",
          "who": "AI: ",
          "timestamp": 1695725910365
        }],
        "newMessage": text,
        "stream": false
      },
      "method": "POST"
    }).then(response => {
      resolve(response.data);
    });
  });
};

// Yanz
async function CAI(query, chark) {
  return new Promise(async (resolve, reject) => {
axios("https://boredhumans.com/api_celeb_chat.php", {
  headers: {
    "cookie": "boredHuman=2023-09-20; website-builder=2; adoptme_ck=f10961a8; ai-tools=1; code_generation=3; article-writer=2; text-to-image=1; research-paper=1; haiku=1; template=2",
    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"
     },
  "data": "message=" + query + "&intro=" + chark + "&name=" + chark,
  "method": "POST"
}).then((response) => {
      resolve(response.data.output);
    }).catch((error) => {
      reject(error);
    });
  });
};

// Rifza
async function photo2anime(url) {
  return new Promise(async(resolve, reject) => {
    let { data } = await axios({
      url: "https://tools.revesery.com/image-anime/convert.php",
      method: "POST",
      data: new URLSearchParams(Object.entries({
        "image-url": url
      })),
      headeres: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    console.log(data)
    resolve(data)
  })

}

module.exports = {
  GPT,
  CAI,
  photo2anime
}