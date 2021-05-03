'use strict';
const http = require('http');
const express = require('express');
const app = express();
const  bodyParser = require('body-parser');
const server = http.createServer(app);
const axios = require('axios');
const logger = require('heroku-logger');
const fs = require('fs');
const verify = (req, res, buf, encoding) => {
  const expected = req.headers['x-hub-signature'];
  const calculated = 'sha256=' + crypto.createHmac('sha256', "secret").update(buf).digest('hex');
  req.verified = expected == calculated;
};
getAllSubs()
app.use(bodyParser.json())
app.post('/onlive', function(req, res) { 
  var status = req.body.subscription.status;
  var challenge = req.body.challenge;
  var payload = req.body.subscription;

 if(challenge !== undefined){
   log(req.body)
   res.status(200).send(challenge);
  }
  else if(payload !== undefined){
    if(status === "authorization_revoked"){
      subscribe();
      doLog(payload)
    }
    else{
      doLog(payload)
      fs.readFile("id.txt", 'utf8', function(err, data) {
        if (err) throw err;
        if(payload.id != data){
          log(payload.id)
          alerteWebHook();
        }
      });
      res.sendStatus(200);
    }
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT, function() {
    console.log("server is listening");
}).on('error', (e) => {
    console.error(e.message);
    throw e;
});
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
function alerteWebHook(){

  const helix = axios.create({
    baseURL: 'https://api.twitch.tv/helix/',
    headers: {
      'Authorization': process.env.TWITCH_TOKEN,
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
      }

  });
  const streamer = process.env.STREAMER
  helix.get('streams?user_login='+streamer).then( function (response) {
    var info = response.data.data[0];
    axios
    .post(process.env.WEBHOOK_DISCORD,{
      "content": "Le live est lancé @everyone",
      "embeds": [{
        "author": {
          "name": info.user_login+" le stream commence !",
          "url": "https://www.twitch.tv/"+info.user_login,
          "icon_url": "https://avatar.glue-bot.xyz/twitch/"+info.user_login
        },
        "fields": [
          {
            "name": "titre",
            "value": info.title,
            "inline": false
          },
          {
            "name": "jeu",
            "value": info.game_name,
            "inline": true
          },
          {
            "name": "Viewers",
            "value": info.viewer_count,
            "inline": true
          }
        ],
        "image": {
          "url":  'https://static-cdn.jtvnw.net/previews-ttv/live_user_'+info.user_login+'-320x180.jpg'
        },
        "color": 9520895
      }]
    })
    .then(res => {
      
    })
    .catch(error => {
      console.error(error)
    });
  })
}
function subscribe(){
  axios
  .post('https://api.twitch.tv/helix/eventsub/subscriptions',{
      "type": "stream.online",
      "version": "1",
      "condition": {
          "broadcaster_user_id": process.env.TWITCH_CHANNEL_ID
      },
      "transport": {
          "method": "webhook",
          "callback": process.env.URL+"/onlive",
          "secret": process.env.TWITCH_SECRET
      }
    },{
      headers: {
        'Authorization': process.env.TWITCH_TOKEN,
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Content-Type': 'application/json'
        }
    })
  .then(res => {
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  });
}
function getAllSubs(){
  axios
    .get('https://api.twitch.tv/helix/eventsub/subscriptions',
    {headers: {
      'Authorization': process.env.TWITCH_TOKEN,
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Content-Type': 'application/json'
      }})
    .then(res => {
      console.log(res)
    })
    .catch(error => {
      console.error(error)
    });
}

function doLog(json){
  logger.info('message', { data:json })
}
function log(id){
  fs.writeFileSync('id.txt', id);
}


// truc à faire :
// enlever le code qui sert à rien => FAIT
// tester la validiter du token 
// tester la revocation du subscribe et re sub si c'est le cas => FAIT
// utiliser le webhook pour la notification (simple à mettre en place sur plusieurs server) => FAIT
// prendre les info de twitch pour remplir le json du webhook => FAIT

