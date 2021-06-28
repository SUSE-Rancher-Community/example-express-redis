const express = require('express');
const pug = require('pug');
const redis = require('redis');
const fs = require('fs');
const { promisify } = require ("util")

const port = process.env.PORT || 8080;

const app = express();
app.use(express.urlencoded({ extended: true }))

const indexTemplate = pug.compileFile('index.pug');

function readServiceParam(servicename, paramname) {
  return fs.readFileSync('/services/' + servicename + '/' + paramname, 'utf8')
}

const redisuri = readServiceParam('shoppinglist-redis', 'uri')

const redisdb = redis.createClient(redisuri)
//redisdb.auth(password);

const lrange = promisify(redisdb.lrange).bind(redisdb)
const rpush = promisify(redisdb.rpush).bind(redisdb)
const lrem = promisify(redisdb.lrem).bind(redisdb)

app.get('/', (req, res) => {
  lrange('list', 0, -1).then( function(items) {
    console.log(items)
    res.send( indexTemplate({ items }) )
  }).catch( function (err) {
    console.log(err)
    res.send(err)
  })
})

app.post('/addvalue', (req, res) => {
  value = req.body.value;
  console.log("Received entry " + value + ", adding to shopping list...");
  rpush("list", value)
  res.redirect(status=302, "/")
})

app.post('/removevalue', (req, res) => {
  value = req.body.value;
  console.log("Received entry " + value + ", removing from shopping list...");
  lrem("list", 0, value)
  res.redirect(status=302, "/")
})

app.listen(port);
