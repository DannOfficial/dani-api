const axios = require('axios');
const cheerio = require('cheerio');

function screenshotWebsite(url, device) {
  return new Promise((resolve, reject) => {
    const baseURL = 'https://www.screenshotmachine.com'
    const param = {
      url: url,
      device: device,
      cacheLimit: 0
    }
    axios({
      url: baseURL + '/capture.php',
      method: 'POST',
      data: new URLSearchParams(Object.entries(param)),
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((data) => {
      const cookies = data.headers['set-cookie']
      if (data.data.status == 'success') {
        axios.get(baseURL + '/' + data.data.link, {
          headers: {
            'cookie': cookies.join('')
          },
          responseType: 'arraybuffer'
        }).then(({
            data
          }) => {
          resolve(data)
        })
      } else {
        reject()
      }
    }).catch(reject)
  })
}

function styleText(text) {
  return new Promise((resolve,
    reject) => {
    axios.get('http://qaz.wtf/u/convert.cgi?text=' + text)
    .then(({
      data
    }) => {
      let $ = cheerio.load(data)
      let result = []
      $('table > tbody > tr').each(function (a, b) {
        result.push({
          text: $(b).find('td:nth-child(2)').text().trim()
        })
      }),
      resolve(result)
    })
  })
}

const base64Encode = (text) => {
  return Buffer.from(text).toString('base64');
};

const base64Decode = (text) => {
  return Buffer.from(text, 'base64').toString('ascii');
};

const base32Encode = (text) => {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';
  let encodedText = '';

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    bits += charCode.toString(2).padStart(8, '0');
  }

  bits = bits.padEnd(Math.ceil(bits.length / 5) * 5, '0');

  for (let i = 0; i < bits.length; i += 5) {
    const index = parseInt(bits.substr(i, 5), 2);
    encodedText += base32Chars[index];
  }

  return encodedText;
};

const base32Decode = (encodedText) => {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = '';

  for (let i = 0; i < encodedText.length; i++) {
    const char = encodedText.charAt(i);
    const index = base32Chars.indexOf(char);
    bits += index.toString(2).padStart(5, '0');
  }

  bits = bits.slice(0, bits.lastIndexOf('1'));

  let decodedText = '';

  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.substr(i, 8);
    const charCode = parseInt(byte, 2);
    decodedText += String.fromCharCode(charCode);
  }

  return decodedText;
};

module.exports = {
  screenshotWebsite,
  styleText,
  base64Encode,
  base64Decode,
  base32Encode,
  base32Decode
};