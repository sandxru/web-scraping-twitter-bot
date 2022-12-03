const Twitter = require('twitter');
const puppeteer = require("puppeteer");
require('dotenv').config()

var buyRate = 0.0
var sellRate = 0.0

async function scrapeBuy(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForXPath('//*[@id="__APP"]/div[2]/main/div[1]/div[4]/div/div[2]/div[6]/div[1]/div[2]/div/div/div[1]')
    await page.waitForSelector('.css-1m1f8hn')
    const [el] = await page.$x('//*[@id="__APP"]/div[2]/main/div[1]/div[4]/div/div[2]/div[6]/div[1]/div[2]/div/div/div[1]');
    const txt = await el.getProperty('textContent')
    const rawTxt = await txt.jsonValue();
    buyRate = parseFloat(rawTxt);
    browser.close();
}

async function scrapeSell(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url);
    await page.waitForXPath('//*[@id="__APP"]/div[2]/main/div[1]/div[4]/div/div[2]/div[6]/div[1]/div[2]/div/div/div[1]')
    await page.waitForSelector('.css-1m1f8hn')
    const [el] = await page.$x('//*[@id="__APP"]/div[2]/main/div[1]/div[4]/div/div[2]/div[6]/div[1]/div[2]/div/div/div[1]');
    const txt = await el.getProperty('textContent')
    const rawTxt = await txt.jsonValue();
    sellRate = parseFloat(rawTxt);
    browser.close();
}


async function runApp() {
    await scrapeBuy('https://p2p.binance.com/en-IN/trade/all-payments/USDT?fiat=LKR')
    await scrapeSell('https://p2p.binance.com/en-IN/trade/sell/USDT?fiat=LKR&payment=ALL')
    
    const consumer_key = process.env.CONSUMER_API_KEY
    const consumer_secret = process.env.CONSUMER_API_SECRET_KEY
    const access_token_key = process.env.ACCESS_TOKEN
    const access_token_secret = process.env.ACCESS_TOKEN_SECRET

    var client = new Twitter({
        consumer_key,
        consumer_secret,
        access_token_key,
        access_token_secret
    });

    client.post('statuses/update', { status: '#USDtether to #LKR RATE on #Binance P2P Market \n\n - Buying : '+ buyRate + ' LKR' + '\n - Selling : ' + sellRate + ' LKR'},
        function (error, tweet, response) {
            if (!error) {
                console.log(tweet);
            }
        });

    console.log("Buying Rate    : ", buyRate);
    console.log("Selling Rate   : ", sellRate);
}

runApp()
