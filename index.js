const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wynhew4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('aarFood').collection('services');
        const reviewCollection = client.db('aarFood').collection('reviews');
        const addServiceCollection = client.db('aarFood').collection('addservices');
        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })

        app.get('/allServices', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/allServices/:id',async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //reviews api
        app.get('/reviews', async(req, res) =>{
            const query ={};
            if(req.query.email){
                query = {
                    email:req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.post('/reviews',async(req, res) =>{
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/addServices', async(req, res) =>{
            const query ={};
            if(req.query.email){
                query = {
                    email:req.query.email
                }
            }
            const cursor = addServiceCollection.find(query);
            const addServices = await cursor.toArray();
            res.send(addServices);
        })


        app.post('/addServices',async(req, res) =>{
            const addService = req.body;
            const result = await addServiceCollection.insertOne(addService);
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(error => console.error(error));


app.get('/', (req, res) =>{
    res.send('aar food server is running')
})

app.listen(port, () =>{
    console.log(`aar food server running on ${port}`);
})