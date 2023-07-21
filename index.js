const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p33egdz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run(){
    try{
        const productCollection = client.db('pawsdb').collection('products')

        app.get('/product',async(req,res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page, size);
            const query = {}
            const cursor = productCollection.find(query);
            const clothe = await cursor.skip(page*size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({count,clothe})
        })

        app.post('/productByIds', async(req, res) =>{
            const ids = req.body;
            console.log(ids)
            const objectIds = ids.map(id => new ObjectId(id))
            const query = {_id: {$in: objectIds}};
            const cursor = productCollection.find(query);
            const clothe = await cursor.toArray();
            res.send(clothe);
        })

    }
    finally{

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) =>{
    res.send('ema john server is running');
})

app.listen(port, () =>{
    console.log(`ema john running on: ${port}`)
})