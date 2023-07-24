const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aujohll.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    const allCollageDatabase = client.db("allCollage").collection("collegesdata");

    app.get("/allcollages", async (req, res) => {
      try {
        const cursor = allCollageDatabase.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error while fetching data from MongoDB:", error);
        res.status(500).send("Error while fetching data from MongoDB");
      }
    });

    app.get("/allcollages/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await allCollageDatabase.findOne(query);
        res.send(result)
        console.log(result);
      } catch (error) {
        console.error("Error while fetching data from MongoDB:", error);
        res.status(500).send("Error while fetching data from MongoDB");
      }
    });

    const admissionDatabase = client.db("admission").collection("admissiondata");

    app.post("/admissiondata", async (req, res) => {
      try {
        const cardata = req.body;
        console.log("new car data", cardata);
        const result = await admissionDatabase.insertOne(cardata);
        res.send(result);
      } catch (error) {
        console.error("Error while fetching data from MongoDB:", error);
        res.status(500).send("Error while fetching data from MongoDB");
      }
    });

    app.get("/admissiondata", async (req, res) => {
      try {
        const cursor = admissionDatabase.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error while fetching data from MongoDB:", error);
        res.status(500).send("Error while fetching data from MongoDB");
      }
    });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
