/** 
 * Big Thanks To
 * DannTeam
 * All Team
 * All Friends
 * Parents
 * God
-------------------
 * Thanks To
 * Arifzyn
 * YanzBot
 * Danz (me)
 * Danzz Coding
 * NowMee (nomisec07)
*/

// Database Mysql
global.connection = {
  host: 'db4free.net',
  user: 'dannteam',
  password: 'DaniGTPS01',
  database: 'dannapi'
};

// SMTP
global.email_SMTP = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'danigtps@gmail.com',
    pass: 'ecimoyaxlhpbksgq'
  }
};

// Limit
global.limit = {
  free: 25,
  premium: 1000
};

/**
 * Untuk versi tanpa enkripsi? 10k (https://wa.me/+6283137550315)
 */

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const audioList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
shuffle(audioList);
const audioUrl = `https://api.dannteam.com/audio/${audioList[0]}.mp3`;

global.web_settings = {
  head: {
    title: "DannTeam API",
    description: "DannTeam API adalah RESTful API yang dibuat dengan Node.js",
    author: "DannTeam",
    keywords: "Rest-API, Restfull-API, API-Rest, Dann-MD, api, DannTeam",
    site_name: "RESTful API's",
    domain: "https://api.dannteam.com",
    favicon: "https://dannteam.com/thumbnail.jpg",
    image: "https://telegra.ph/file/b849a052a00dbbfcd53fd.jpg",
    image_type: "image/jpg",
    image_width: 400,
    image_height: 300,
    image_alt: "DannTeam"
  },
  body: {
    header: {
      firstname: "DannTeam",
      lastname: "API",
      nav: {
        firstname: "DannTeam",
        lastname: "API",
        cbox: {
          url: "https://my.cbox.ws/Dann-API",
          width: "100%",
          height: 450
        }
      },
      thanks_to: {
        name: "DannTeam"
      }
    },
    footer: {
      name: "DannTeam"
    }
  },
  parameters: {
    text: "DannTeam",
    image: "https://telegra.ph/file/b849a052a00dbbfcd53fd.jpg"
  },
  pricing: {
    plan1: "https://wa.me/+6283137550315?text=Permisi, saya mau beli user premium paket 1, dengan harga 15k",
    plan2: "https://wa.me/+6283137550315?text=Permisi, saya mau beli user premium paket 2, dengan harga 30k",
    plan3: "https://wa.me/+6283137550315?text=Permisi, saya mau beli user premium paket 3, dengan harga 60k",
    plan4: "https://wa.me/+6283137550315?text=Permisi, saya mau beli user premium paket 4, dengan harga 90k gratis 1 script bot.",
    plan5: "https://wa.me/+6283137550315?text=Permisi, saya mau heli user premium paket 5, dengan harga 120k gratis 1 script bot."
  },
  contact_support: "danigtps@gmail.com",
  random_audio: audioUrl
};

// Global constants
global.port = 3000;
global.secrect_session = "DannTeam";
global.password_admin = "DannKristi";
global.author = "DannTeam";
global.api_canvas = "https://canvas.dannteam.com";

// API Keys
global.openai_chatGPT_API_key = [
  "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"
];

global.bitly_access_token = [
  "2243940c230ad0d748059aee58ddf126b65fd8e7",
  "6cfc18e9bfa554714fadc10a1f6aff7555642348",
  "c71b6658a1d271ddaf2a5077de3dcb9d67f68025",
  "cddbceccdc2f1c9d11e4cdd0d2b1d1078e447c43",
  "7915c671fbd90eca96310e5c9442d761225a1080",
  "e5dee46eb2d69fc9f4b0057266226a52a3555356",
  "f09ab8db9cf778b37a1cf8bc406eee5063816dec",
  "964080579f959c0cc3226b4b2053cd6520bb60ad",
  "a4f429289bf8bf6291be4b1661df57dde5066525",
  "3d48e2601f25800f375ba388c30266aad54544ae",
  "4854cb9fbad67724a2ef9c27a9d1a4e9ded62faa",
  "d375cf1fafb3dc17e711870524ef4589995c4f69",
  "43f58e789d57247b2cf285d7d24ab755ba383a28",
  "971f6c6c2efe6cb5d278b4164acef11c5f21b637",
  "ae128b3094c96bf5fd1a349e7ac03113e21d82c9",
  "e65f2948f584ffd4c568bf248705eee2714abdd2",
  "08425cf957368db9136484145aa6771e1171e232",
  "dc4bec42a64749b0f23f1a8f525a69184227e301",
  "0f9eb729a7a08ff5e73fe1860c6dc587cc523035",
  "037c5017712c8f5f154ebbe6f91db1f82793c375"
];

global.cuttly_access_token = [
  "b21fd60e1270f003474834bf1b645888ab8c3"
];

global.remove_bg_API_key = [
  "vhdZxNuajV3g2XGV9eMmQUxu"
];
