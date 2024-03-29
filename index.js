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
function ifUTC(utcTime){
  return /-/g.test(utcTime)
}
// convert valid date to unix time (milliseconds)
function convert2UTC(unix){
  return +unix+((60000*60)*5)
}
// format utc string
function formatUTC(day,dayNum,month,year,time,zone,utc){
      return `${day}, ${dayNum} ${month} ${year} ${time} ${zone}`
}
// check for leap year
let isLeapYear = (year) => {
let firstLeap = 1972;
let four = 4;
return (year % firstLeap) % four === 0 
}

// is date valid?
function dateValidity(dateString) {
  // test february dates
  let day =   new Date(dateString).toString().split` `[2]
  let month = new Date(dateString).getMonth();
  let year = new Date(dateString).getFullYear()
  let possible_march = new Date(dateString).toString().split` `[1]
  let bool;
  return !isNaN(Date.parse(dateString))

}
// request to unix & request to utc
app.get("/api/:date?", (req,res)=>{
  // let first = req.query.first
//     let last = req.query.last

//     res.json({name: `${first} ${last}`})
  let { date } = req.params
  if(!date){
    date = new Date()
  }
  let unix=new Date(req.query.unix).getTime(), utc=new Date(req.query.utc).toString();
  if(ifUnix(date)){
    unix = +date;
    let futureUnix = new Date(convert2UTC(unix)).getTime()
    let unix2UTC=new Date(futureUnix).toString();
    // console.log(date)
    // console.log(futureUnix)
    // console.log(unix2UTC)
    let arr = unix2UTC.split` `
    let day = arr[0]
    let month = arr[1]
    let dayNum = arr[2]
    let year = arr[3]
    let time = arr[4]
    utc = formatUTC(day,dayNum,month,year,time,`GMT`,utc)
    res.json({unix:unix,utc:utc})
      }
  else if((ifUTC(date))){
    if(dateValidity(date)){
      unix = +(new Date(date).getTime());
      let futureUnix = new Date(convert2UTC(unix)).getTime();
      let unix2UTC=new Date(futureUnix).toString();
      console.log(date)
      console.log(futureUnix)
      console.log(unix2UTC)
      let arr = unix2UTC.split` `
      let day = arr[0]
      let month = arr[1]
      let dayNum = arr[2]
      let year = arr[3]
      let time = arr[4]
      utc = formatUTC(day,dayNum,month,year,time,`GMT`,utc)
      res.json({unix:unix,utc:utc})
    }
    else{
      res.json({ error : "Invalid Date" })
    }
  }
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
