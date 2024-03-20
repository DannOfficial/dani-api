const axios = require("axios");
const cheerio = require("cheerio");

async function ttStory(username) {
  return new Promise(async (resolve, reject) => {
    await axios
      .request({
        baseURL: "https://tik.storyclone.com",
        url: "/user/" + username,
        method: "GET"
    })
    .then(( response ) => {
      const $ = cheerio.load(response.data)
      const result = {
        profile: $("div.row > div.col-lg-7.separate-column > div.user-info > figure > img").attr("src"),
        username: $("div.row > div.col-lg-7.separate-column > div.user-info > div.article > div.top > div.title > h1").text().trim(),
        name: $("div.row > div.col-lg-7.separate-column > div.user-info > div.article > div.top > div.title > h2").text().trim(),
        desc: $("div.row > div.col-lg-7.separate-column > div.user-info > div.article > div.description > p").text().trim(),
        likes: $("div.col-lg-5.separate-column > div.row > div.col > div.number-box > .count").eq(0).text().trim(),
        followers: $("div.col-lg-5.separate-column > div.row > div.col > div.number-box > .count").eq(1).text().trim(),
        following: $("div.col-lg-5.separate-column > div.row > div.col > div.number-box > .count").eq(2).text().trim(),
      }
      resolve(result)
    })
    .catch((e) => {
      console.log(e)
      reject({
        status: 300,
        message: "request failed",
      });
    })
  })
}

module.exports = {
  ttStory
}