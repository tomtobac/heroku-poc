const twilio = require('twilio');

const ACCOUNT_SID = 'AC96ccc904753b3364f24211e8d9746a93';
const AUTH_TOKEN  = '64cba9bbf5c511b7ddc38740838ac57c';

const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);

const express = require('express');
const app = express();

  
const { MongoClient } = require('mongodb')

const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'store';

app.get('/db', (req, res) => {
    MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
        db = client.db(dbName);
        res.json({ client });
      });
});

app.get('/call', async (req, res) => {
    const response = await client.calls.create({
        twiml: '<?xml version="1.0" encoding="UTF-8"?><Response><Say>Hello World</Say></Response>',
        to: '+34633412101',
        from: '+18337840147',
        statusCallback: 'https://648a3980.ngrok.io/',
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      });

      res.json(response)
});

app.post('/', (req, res) => {
    res.json({ domain: req.domain, headers: req.headers, env: process.env });
});

app.get('/version', (req, res) => {
    res.json({ env: process.env });
});

const port  = process.env.PORT || 8080;

app.listen(port, () => console.log(`Gator app listening on port ${port}!`));
