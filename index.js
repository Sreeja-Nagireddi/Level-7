const request = require('request');
const express = require('express')
const app = express();
const port = 3000;

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

const serviceAccount = require('./key.json')

initializeApp({
    credential: cert(serviceAccount)
});

const db=getFirestore();

app.set("view engine","ejs")
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/register', (req, res) => {
    res.render("register");
  })
app.get('/registersubmit',(req,res)=>{
  const first_name=req.query.fn;
    const last_name=req.query.ln;
  const email=req.query.email;
    const password=req.query.pwd;

    db.collection('users').add({
      name:first_name + last_name,
      email:email,
      password:password
    }).then(() =>{
      res.render("login");
    })
});
  app.get('/login', (req, res) => {
    res.render("login");
  })
  app.get('/loginfail',(req,res)=>{
    res.render("loginfail");
  })
app.get('/loginsubmit',(req,res) =>{
  const email=req.query.email;
    const password=req.query.pwd;
     db.collection("users")
     .where("email","==",email)
     .where("password","==",password)
     .get()
     .then((docs) =>{
      if(docs.size> 0){
        res.render("main");
      }
      else{
        res.render("loginfail");
      }
     });
});

app.get('/getdatasubmit',(req,res) =>{
  const name = req.query.gds;
  console.log(name);

  request.get({
    url: 'https://api.api-ninjas.com/v1/urllookup?url=' + name,
    headers: {
      'X-Api-Key': '7wmW5BJK0NzvsIk/KHZCHQ==A3a76WVr49AFFSu9'
    },
  },function (error, response, body){
      if("error" in JSON.parse(body)){
        if((JSON.parse(body).error.code.toString()).length > 0){
          res.render("main");
        }
      }
      else{
        const is_valid= JSON.parse(body).is_valid;
        const country= JSON.parse(body).country;
        const country_code= JSON.parse(body).country_code;
        const region_code= JSON.parse(body).region_code;
        const region= JSON.parse(body).region;
        const city= JSON.parse(body).city;
        const zip= JSON.parse(body).zip;
        const lat= JSON.parse(body).lat;
        const lon= JSON.parse(body).lon;
        const timezone= JSON.parse(body).timezone;
        const isp= JSON.parse(body).isp;
        const url= JSON.parse(body).url;

        res.render('title',{
          is_valid:  is_valid,
          country:country,
          country_code:country_code,
          region_code:region_code,
          region:region,
          city: city,
          zip: zip,
          lat:lat ,
          lon: lon,
          timezone: timezone,
          isp: isp,
          url: url
        });
    } 
    });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})