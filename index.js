const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpqcv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 3001


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const orders = client.db("emaJohnStore").collection("orders");

  app.get('/', (req, res) => {
    res.send('hello world');
})
  
    app.post('/addProducts', (req, res) => {
        const product = req.body;
        console.log(product)
        products.insertOne(product)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.get('/products', (req, res) => {
        products.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/products/:key', (req, res) => {
        products.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        products.find({key: { $in: productKeys }})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order)
        orders.insertOne(order)
        .then(result => {
            res.send(result.insertedCount)
        })
    })
  //client.close();
});


app.listen(port)