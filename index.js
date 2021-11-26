const express = require('express');
const app = express();
require("dotenv").config();
const { MongoClient } = require("mongodb");
var cors = require("cors");

const port = process.env.PORT || 5000;


const ObjectId = require("mongodb").ObjectId;
//middleware
app.use(express.json());
app.use(cors());

// database setup 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jk76k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("starhotel");
    const s_service_Collection = database.collection("sService");
    const package_Sale_Collection =
      database.collection("package_sale");
    
      
//get all api
      app.get('/services', async (req, res) => {
          const services = s_service_Collection.find({});
          const result = await services.toArray();
          res.send(result);
      })
//delete event api 
    app.delete('/eventDelete/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      console.log(query);
      const result = await s_service_Collection.deleteOne(query);
      console.log(result);
      res.json(result)
    })
//get one api
      app.get("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await s_service_Collection.findOne(query);
        
        res.send(result);
      });
      
//post api
      app.post('/v_register', async (req, res) => {
          const result = await package_Sale_Collection.insertOne(
            req.body
          );
          res.json(result)
      })

//event get api 
      app.get("/events/:email", async (req, res) => {
          const email = req.params.email
          const query = { Email: email };
          const result = await package_Sale_Collection.find(query).toArray();
          res.send(result);
      });

//event delete
      app.delete("/volunteerDelete/:id", async (req, res) => {
        const id = req.params.id;
        // console.log(id);
        const query = { _id: ObjectId(id) };
        // console.log(query);
          const result = await package_Sale_Collection.deleteOne(query);
          
          res.json(result)
      })
//get all the event memeber 
    app.get("/members", async (req, res) => {
      const cursor = package_Sale_Collection.find({});
      const result = await cursor.toArray();
    
      res.send(result)
    })
    //post service by admin memeber

    app.post('/addservice', async (req, res) => {
      const post = req.body;
      const result = await s_service_Collection.insertOne(post);
    
      res.json(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Star Hotel Server is Running');
})

app.listen(port, () => {
    console.log("start on port",port);
})