// index.js
// where your node app starts

// init project
require('dotenv').config()
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
//test for unix time with a regex test
function ifUnix(unixTime){
  return /^\d+$/.test(unixTime)
}
// convert valid date to unix time (milliseconds)
function convert2UTC(unix){
  return +unix+((60000*60)*5)
}
// format utc string
function formatUTC(day,dayNum,month,year,time,zone,utc){
      return `${day}, ${dayNum} ${month} ${year} ${time} ${zone}`
}
// request to unix & request to utc
app.get("/api/:date?", (req,res)=>{
  let { date } = req.params
  let unix, utc;
  if(ifUnix(date)){
    unix = date;
    let temp_utc = new Date(convert2UTC(unix)).toString(); 
    let arr = temp_utc.split` `
    let day = arr[0]
    let month = arr[1]
    let dayNum = arr[2]
    let year = arr[3]
    let time = arr[4]
    let zone = arr[5].slice(0,3)
    utc = formatUTC(day,dayNum,month,year,time,zone,utc)
      }
  else{
    unix = new Date(date).getTime();
    let temp_utc = new Date(convert2UTC(unix)).toString(); 
    let arr = temp_utc.split` `
    let day = arr[0]
    let month = arr[1]
    let dayNum = arr[2]
    let year = arr[3]
    let time = arr[4]
    let zone = arr[5].slice(0,3)
    utc = formatUTC(day,dayNum,month,year,time,zone,utc)
  }
      res.json({unix:unix,utc:utc})
      
})

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
