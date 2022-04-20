var http=require('http');
var url = require('url');  
var fs = require('fs');
var qs = require('querystring');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
var channelName;
var latestTitle=100;
const sendMail = require("./MailSender");
var url1;


async function fetchFromYouTube(resp) {
    const browser = await puppeteer.launch()
     const page = await browser.newPage()
      await page.goto(url1)
	  
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
        return VideoTitles;
     
}

function compare() {
url1 = 'https://www.youtube.com/c/'+channelName+'/videos';
console.log(url1);
  let previousTitle;
fetchFromYouTube((data)=>{
  previousTitle=  getLatestTitle(data);
}).then(()=> {
  fetchFromYouTube((data)=>{
    latestTitle = getLatestTitle(data);
  if(latestTitle[0].title !== previousTitle[0].title) {
console.log('new video found');
}
console.log(latestTitle);
//sendMail("Trick Shot Video Found",latestTitle,"https://www.youtube.com");
  })
  })
}

var server = http.createServer(function(request, response) {  
    var path = url.parse(request.url).pathname;  
    switch (path) {  
        case '/':  
            fs.readFile(__dirname + "/firstPage.html", function(error, data) {  
                if (error) {  
                    response.writeHead(404);  
                    response.write(error);  
                    response.end();  
                } else {  
                    response.writeHead(200, {  
                        'Content-Type': 'text/html'  
                    });  
                    response.write(data);  
                    response.end();  
                }  
            });  
            break;              
		case '/next':
			if(request.method=="POST"){
				var body = '';
				request.on('data', function(data) {
					body += data;
				})
				request.on('end', function() {
					var formData=qs.parse(body);
					channelName=formData.chanName;
					compare();
					setTimeout(function afterTwoSeconds() {
						response.writeHead(200, {  
							'Content-Type': 'text/html'  
						});
						console.log(latestTitle);
						var datanow="<center><form action='/sendmail' method='POST'><input type='text' placeholder='Enter Email ID'name='emailid'></input></br></br><button type='submit' style='background-color:#228B22; border-color:blue'>SEND EMAIL</button></br><p style='text-align:center' text>© 202011001 & 202011017</p></br></form></center><ul>";
						for(i=0;i<latestTitle.length;i++){
							datanow=datanow + "<li>"+latestTitle[i].title+" - "+latestTitle[i].link+"</li>";
						}
						datanow=datanow+"</ul>";
						response.write(datanow);
						response.end();
					}, 30000)

				})
			}
			break;
		case '/sendmail':
			if(request.method=="POST"){
				var body = '';
				request.on('data', function(data) {
					body += data;
				})
				request.on('end', function() {
					var formData=qs.parse(body);
					var emailid=formData.emailid;
					fs.readFile(__dirname + "/mailSent.html", function(error, data) {  
					if (error) {  
						response.writeHead(404);  
						response.write(error);  
						response.end();  
					} else {  
						console.log("Click Here!!!");
						sendMail("List of videos and links",latestTitle,"https://www.youtube.com/",emailid);
						response.writeHead(200, {  
							'Content-Type': 'text/html'  
						});
						response.write(data);
						response.end();
							}  
            });
				})
			}
			
			break;
			
				
	}
});
server.listen(8080,function(){
	console.log("Server is running at localhost:8080")
});


