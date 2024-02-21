const express = require('express')
const cors = require('cors');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@jafardipu.hwlq4pv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

  
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection = client.db("fashionHouse").collection("products");
    const cartCollection = client.db("fashionHouse").collection("cartData");

    app.get('/products', async (req,res)=>{
      try{
        const result = await productsCollection.find().toArray();
        res.send(result); 
      }
      catch{
        //error handle
      }
    });

    app.get('/products/:id', async (req, res)=>{
      try{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.send(result)
      }
      catch{
        
      }
    });

    app.get('/cart/:email', async(req, res)=>{
      try{
        const email = req.params.email;
        const query = {email: email};
        const result = await cartCollection.find(query).toArray();
        res.send(result)
      }
      catch{
        //error handle
     }
    })

    app.post("/products", async(req, res)=>{
      try{
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
      }
      catch{
        //error handle
     }
    })

    app.post("/cart", async(req,res)=>{
      try{
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.send(result);
      }
      catch{
         
      }
    });

    app.put("/products/:id", async(req,res)=>{
      try{
      const id = req.params.id;
      const product = req.body;
      const query = {_id: new ObjectId(id)};
      const option = {upsert: true};
      const UpdateProduct = {
        $set:{
          image: product?.image,
          name: product?.name,
          type: product?.type,
          price: product?.price,
          rating: product?.rating,
          brandName: product?.brandName,
          details: {
            material: product?.details?.material,
            color: product?.details?.color,
            size: product?.details?.size,
          }
        }
      }

      const result = await productsCollection.updateOne(query,UpdateProduct,option);
      res.send(result)
    }
    catch{
      //error handle
    }
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req,res)=>{
    res.send("JU Fashion ON going")
});

app.listen(port, ()=>{
    console.log(`JU Fashion ON going ${port}`)
})