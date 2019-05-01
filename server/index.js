const fetch = require('node-fetch')
const express = require('express');
const cors = require('cors');
const monk = require('monk');


const port = 3003;

let query = 'steve%20jobs'

const app = express();

const db = monk('localhost/mzanzi-trivia');
const authors = db.get('authors');

app.use(cors())
app.use(express.json())

app.get('/', async function (req, res) {
  res.send(query)
});


app.post('/authors', (req, res) => {
  if (isValidAuthor(req.body)) {
    const author = {
      name: req.body.name,
      quote: req.body.quote
    }

    authors
      .insert(author)
      .then(auth => res.json(auth))
  } else {
    res.status(422);
    res.json({
      message: "Name and quote are required"
    })
  }
})

app.get('/authors', (req, res) => {
  authors
    .find()
    .then(authors => res.json(authors))
})

app.post('/authors/delete', (req, res) => {
  console.log(`deleting ${req.body._id}`)

  authors
    .find(req.body._id)
    .then(author => {
      if (author.length <= 0) {
        res.status(422)
        res.json({
          message: `unable to delete author ${req.body._id}`
        })
      } else {

        authors
          .remove(req.body)
          .then((result) => {
            res.status(200)
            res.json({
              message: `deleted ${req.body._id}`
            })
          })
      }
    })
})

function isValidAuthor(author) {
  return author.name && author.name.toString().trim() != "" &&
    author.quote && author.quote.toString().trim() != "";
}

app.listen(port);
console.log(`listening on ${port}...`)





