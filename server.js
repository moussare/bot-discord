'use strict';
const Discord = require('discord.js');

const bot = new Discord.Client();

const http = require('http');
const express = require('express');
const app = express();
const  bodyParser = require('body-parser');
const server = http.createServer(app);
const URL = process.env.URL;
const axios = require('axios')

axios
  .post('https://api.twitch.tv/helix/eventsub/subscriptions',{
      "type": "stream.online",
      "version": "1",
      "condition": {
          "broadcaster_user_id": "198743554"
      },
      "transport": {
          "method": "webhook",
          "callback": URL+"/onlive",
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
    //console.log(res)
  })
  .catch(error => {
    console.error(error)
  });
/*axios
  .post('https://api.twitch.tv/helix/webhooks/hub',{
      'hub.mode':'unsubscribe',
      'hub.topic':'https://api.twitch.tv/helix/streams?user_id=5678',
      'hub.callback':URL+'/unsubscribe',
      'hub.secret':'s3cRe7terhbsigvfgjkffduiasvbedfsio'
      },{
      headers: {
        'Authorization':'Bearer 9li0ax49dtj97eshpxfaom33ek8crp',
        'Client-ID': 'fkbgiixgaax35iowknli2d7liw00bq',
        'Content-Type': 'application/json'
        }
    })
  .then(res => {
  })
  .catch(error => {
    console.error(error)
  });*/
/*axios
  .get('https://api.twitch.tv/helix/webhooks/subscriptions',{
      headers: {
        'Authorization':'Bearer 9li0ax49dtj97eshpxfaom33ek8crp',
        'Client-ID': 'fkbgiixgaax35iowknli2d7liw00bq'
        }
    })
  .then(res => {
    console.log(res.data)
  })
  .catch(error => {
    console.error(error)
  });*/

/*axios
  .post('https://api.twitch.tv/helix/eventsub/subscriptions',{
      "type": "stream.online",
      "version": "1",
      "condition": {
          "broadcaster_user_id": "198743554"
      },
      "transport": {
          "method": "webhook",
          "callback": URL+"/onlive",
          "secret": "s3cRe7terhbsigvfgjkffduiasvbedfsio"
      }
    },{
      headers: {
        'Authorization':'Bearer 9li0ax49dtj97eshpxfaom33ek8crp',
        'Client-ID': 'fkbgiixgaax35iowknli2d7liw00bq',
        'Content-Type': 'application/json'
        }
    })
  .then(res => {
    //console.log(res)
  })
  .catch(error => {
    console.error(error)
  });
 axios
  .post('https://api.twitch.tv/helix/webhooks/hub',{
      'hub.mode':'subscribe',
      'hub.topic':'https://api.twitch.tv/helix/streams?user_id=198743554',
      'hub.callback':'https://b5345a0c6c31.ngrok.io/onlive',
      'hub.lease_seconds':'120', 
  //'hub.secret':'s3cRe7terhbsigvfgjkffduiasvbedfsio'
      },{
      headers: {
        'Authorization':'Bearer 9li0ax49dtj97eshpxfaom33ek8crp',
        'Client-ID': 'fkbgiixgaax35iowknli2d7liw00bq',
        'Content-Type': 'application/json'
        }
    })
  .then(res => {
  })
  .catch(error => {
    console.error(error)
  });*/

const verify = (req, res, buf, encoding) => {
    const expected = req.headers['x-hub-signature'];
    const calculated = 'sha256=' + crypto.createHmac('sha256', "s3cRe7terhbsigvfgjkffduiasvbedfsio").update(buf).digest('hex');
    req.verified = expected == calculated;
};
app.use(bodyParser.json())
/*app.get('/onlive',(req, res) =>{
  console.log(req);
  var challenge = req.query['hub.challenge'];
  res.status(200).send(challenge); // Responding is important
})*/
app.post('/onlive', function(req, res) { 
  console.log(req.body);
  var id = req.body.subscription.id;
  var status = req.body.subscription.status;
  var challenge = req.body.challenge;
  var payload = req.body.subscription;
 // var id = req.body.subscription["id"];
 // '7760b62d-89d9-41a9-8aa6-6668774bea9d'
 if(challenge !== undefined){
   res.status(200).send(challenge);
  }
  else if(payload !== undefined){
    if(status === "authorization_revoked"){
      axios
      .post('https://api.twitch.tv/helix/eventsub/subscriptions',{
          "type": "stream.online",
          "version": "1",
          "condition": {
              "broadcaster_user_id": process.env.TWITCH_CHANNEL_ID
          },
          "transport": {
              "method": "webhook",
              "callback": URL+"/onlive",
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
        //console.log(res)
      })
      .catch(error => {
        console.error(error)
      });
    }
    else{

      const embed = new Discord.MessageEmbed()
      
      embed.setTitle('alkia_tv est en live !');
      embed.setColor(0xff0000);
      // embed.setDescription('@everyone');
      embed.setURL('https://www.twitch.tv/alkia_tv');
      embed.setThumbnail('https://avatar.glue-bot.xyz/twitch/alkia_tv');
      embed.setImage('https://static-cdn.jtvnw.net/previews-ttv/live_user_alkia_tv-500x500.jpg');
      
      bot.channels.cache.get(process.env.CHANNEL_ID).send(embed);
    }
    /*  axios
      .delete(' https://api.twitch.tv/helix/eventsub/subscriptions?id='+id,{
        'hub.mode':'unsubscribe',
        'hub.topic':'https://api.twitch.tv/helix/streams?user_id=198743554',
        'hub.callback':URL+'/unsubscribe',
        'hub.lease_seconds':'120', 
        //'hub.secret':'s3cRe7terhbsigvfgjkffduiasvbedfsio'
      },{
        headers: {
          'Authorization':'Bearer 9li0ax49dtj97eshpxfaom33ek8crp',
          'Client-ID': 'fkbgiixgaax35iowknli2d7liw00bq',
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
      })
      .catch(error => {
        console.error(error)
      });*/
      /*   axios
      .post('https://api.twitch.tv/helix/webhooks/hub',{
        'hub.mode':'unsubscribe',
        'hub.topic':'https://api.twitch.tv/helix/streams?user_id=198743554',
        'hub.callback':URL+'/unsubscribe',
        'hub.lease_seconds':'120', 
        //'hub.secret':'s3cRe7terhbsigvfgjkffduiasvbedfsio'
      },{
        headers: {
          'Authorization':'Bearer 9li0ax49dtj97eshpxfaom33ek8crp',
          'Client-ID': 'fkbgiixgaax35iowknli2d7liw00bq',
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
      })
      .catch(error => {
        console.error(error)
      });*/
    }
});
/*app.get('/unsubscribe', function(req, res) { 
  var challenge = req.query['hub.challenge'];
  console.log(challenge);
  res.status(200).send(challenge); // Responding is important
});
app.post('/unsubscribe', function(req, res) { 
  var challenge = req.query['hub.challenge'];
  console.log(challenge);
  res.status(200).send(challenge); // Responding is important
});*/
server.listen(80, 'localhost', function() {
    console.log('listening at http://%s:%s', 'localhost', 80);
}).on('error', (e) => {
    console.error(e.message);
    throw e;
});

bot.login(process.env.DISCORD_TOKEN);
