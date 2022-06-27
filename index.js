const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

//middleware

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shcd9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const spiceCollection = client.db('Cuisine1').collection('spice1')
        console.log('db connected');
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = spiceCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const product = await spiceCollection.findOne(query);
            res.send(product)
        })

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = req.body.updatedQuantity;

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedQuantity,

                }
            }
            console.log(updatedDoc);
            const result = await spiceCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const newQuantity = req.body.newQuantity;
            console.log(newQuantity);

            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: newQuantity,

                }
            }
            console.log(updatedDoc);
            const result = await spiceCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await spiceCollection.deleteOne(query);
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await spiceCollection.insertOne(newProduct);
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('running cuisine server')
})

app.listen(port, () => {
    console.log('listening to port', port);
})