var aws = require('aws-sdk');
var ses = new aws.SES({ region: 'us-west-2' });
var request = require('request');
var cheerio = require('cheerio');

const checkInventory = () => {
    //Paste the url for the product you want
    const url = "https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-1-1-32gb-console-with-grey-joy%e2%80%91con%e2%84%a2/p/108083713"
    //Paste the cookie of your browser when you manually check website with a browser
    const cookie = "";
    //Set up in AWS SES following tutorial
    const sourceEmailAddr = "xyz@gmail.com";
    const destinationEmailAddrs = ["abc@qq.com"];
    
    const req = {
        url: url,
        headers: {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "axios/0.18.0",
            "Cookie": cookie
        }
    }
    request(req, (error, response, body) => {
        if (error) {
            console.log(error);
        }
        console.log("Status code: " + response.statusCode);
        const $ = cheerio.load(body);
        const status = $('.fulfillment-add-to-cart-button div button').text().trim();
        console.log("Inventory status: " + status);
        console.log("time: " + (new Date).toUTCString() + "\n");
        if (status !== "Sold Out") {
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!");
            var params = {
                Destination: {
                    ToAddresses: destinationEmailAddrs
                },
                Message: {
                    Body: {
                        Text: { Data: "" }
                    },
                    Subject: { Data: "Nintendo Switch is available!" }
                },
                Source: sourceEmailAddr
            };
            ses.sendEmail(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("email sent")
                    console.log(data);
                }
            });
        }
    });
}
console.log("Script starting...")
setInterval(checkInventory, 30000);
