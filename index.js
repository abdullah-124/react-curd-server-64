const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require('cors')
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId

const app = express();
const port = 4000;
//middleware
app.use(cors())
app.use(express.json())

// username : carUstad1
// password : S1hwV462nV08GgqN
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1aqvj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log('connected to database')
    const database = client.db("carMechanic");
    const serviceCollection = database.collection("services");

    // GET API 
    app.get('/services', async(req, res)=>{
      const cursor = serviceCollection.find({})
      const services = await cursor.toArray()
      res.send(services)
    })

    // GET SINGLE SERVICES 
    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id
      console.log("getting singleid ",id)
      const query = { _id: ObjectId(id) }
      const service = await serviceCollection.findOne((query))
      res.send(service)
    })

    // POST API
    app.post("/addService", async (req, res) => {
      const service = req.body;
      console.log('Hit the Post Api', service)
      const result = await serviceCollection.insertOne(service)
      console.log(result)
      res.json(result)
    });
    // DELETE API 
    app.delete('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await serviceCollection.deleteOne(query)
      res.json(result)
    })
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running genius server");
});

app.listen(port, () => {
  console.log("running genius server on port", port);
});
