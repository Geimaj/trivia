// const fetch = require('node-fetch')
const express = require('express');
const cors = require('cors');
// const monk = require('monk');
// const monkDebug = require("monk-middleware-debug");
const MongoClient = require('mongodb').MongoClient;


const app = express();
const port = 3003;
const connectionString = process.env.MONGO_URI || 'mongodb://localhost/mzanzi-trivia';
console.log(connectionString)

let authors;

MongoClient.connect(connectionString, (error,client) => {
    if (error) throw error;

    const mongo = client.db('mzanzi-trivia');
    authors = mongo.collection("authors");

    app.listen(port);
    console.log(`listening on ${port}...`);
    
  })
  
  app.enable('trust proxy')
  app.use(cors())
  app.use(express.json())
  
  app.get('/', async function (req, res) {
    res.send("Hello, Mzanzi!")
  });


  function getAuthors(option){
    return new Promise((resolve, reject) => {
      authors.find(option).toArray((error, data) => {
        if(error){
          reject(error);
        } else {
          resolve(data)
        }
      })
    })
  }

  app.get('/authors', (req, res) => {
    console.log('GET authors')
    getAuthors()
      .then(result => res.json(result))
      .catch(error => {
        res.status(500)
        res.json({message: error})
        console.log(error)
      })
  })

app.post('/authors', (req, res) => {
  console.log(req.body)
  if (isValidAuthor(req.body)) {
    const author = {
      name: req.body.name,
      quotes: [req.body.quote],
      image: req.body.image
    }

    getAuthors({name: author.name})
      .then(a => {
          if(a.length > 0){
            let quotes = a[0].quotes || [];
            quotes.push(req.body.quote);

            authors
              .updateOne({name: author.name}, {
                $set: {
                    quotes: quotes,
                    image: author.image
                  }
              })
              .then(docs => res.json(author))

          } else {
            console.log('insert')
            authors
              .insertOne(author)
              .then(docs => res.json(author))
          }
      })

  } else {
    res.status(422);
    res.json({
      message: "Name and quote are required"
    })
  }
})
  

app.post('/authors/delete', (req, res) => {
  console.log(`deleting ${req.body._id}`)

  let target = {name: req.body.name}

  getAuthors(target)
    .then(result => console.log(result))
    .catch((error) => {
      console.log('error finding ' + target._id)
      console.log(error)
    })

  authors
    .deleteOne(target)
    .then((result) => {
      console.log(result.deletedCount)
      res.json({
        message: `deleted ${req.body._id}`
      })
    })
    .catch((error) =>{
      res.status(422)
      console.log('error')
      res.json({
        message: `unable to delete author ${req.body._id}`
      })
    })

})

function isValidAuthor(author) {
  return author.name && author.name.toString().trim() != "" &&
    (author.quote && author.quote.toString().trim() != "" || author.image && author.image.toString().trim() != "");
}





