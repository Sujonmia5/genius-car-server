const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('hello server')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mevcjc0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const carCollection = client.db('GeniusCar').collection('services')
        const ordersCollection = client.db('GeniusCar').collection('Orders')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = carCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollection.findOne(query);
            // console.log(result);
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.send(result);
        })

        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email,
                }
            }
            // console.log(query);
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(err => console.log(err))

app.listen(port, () => {
    console.log('hello world', port);
})