const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');

const url = 'https://www.youtube.com/c/MostlySane/videos';
const string = 'Will I write a Book?';
const title = '';
const sendMail = require("./MailSender");


async function fetchFromYouTube(resp) {
    const browser = await puppeteer.launch()
     const page = await browser.newPage()
      await page.goto(url)
      waitUntil: 'networkidle2'
      resp(await page.content());
      browser.close()
     
}
function getLatestTitle(data) {
const $ = cheerio.load(data);
      let VideoTitles = [];
      $('div #details').children('div #meta').children('h3').children('a').each(function(i,el){ 
        VideoTitles.push( {title: $(el).text(), link : $(el).attr('href')});
        })
	console.log(VideoTitles);
        return VideoTitles[0];
      
}

function compare() {
  let previousTitle,latestTitle;
fetchFromYouTube((data)=>{
  previousTitle=  getLatestTitle(data);
}).then(()=> {
  fetchFromYouTube((data)=>{
    latestTitle = getLatestTitle(data);
  //if(latestTitle.title !== previousTitle.title) {
    console.log('New Video Found!!!');
    if(latestTitle.title.includes('Will I Write A Book?')) {
   sendMail("Watch This Video!!!",title.title,title.link,"https://www.youtube.com/watch?v=pBDNESmMVT0");
    //}
  }
  })
})
.then(()=>{
  compare();
})
}

compare();