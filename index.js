const express = require('express');;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(cors({
  // origin:['http://localhost:5173'],
  origin:[
    'http://localhost:5173',
    'https://car-genius-18058.web.app',
    'https://car-genius-18058.firebaseapp.com'
     ],
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());

// miidleware  written here
// const corsConfig = {
//   origin: '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
//   }
//   app.use(cors(corsConfig))
// app.use(express.json());

 

//middleware
const logger= async(req, res, next) =>{
  console.log('called:', req.host, req.originalUrl)
  next();
}

const verifyToken = async(req, res, next) =>{
  const token = req?.cookies?.token;
  console.log('value of token in middleware', token)

  if(!token){
    return res.status(401).send({message: 'unauthorized access'})

  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded) =>{
    //error
    if(err){
      console.log(err);
      return res.status(401).send({message: 'unauthorized access'})
    }

//if token is valid then it would be docoded

console.log('value in the token', decoded)

req.user = decoded

next()
  })
 
}

// const verifyToken = async(req, res, next) =>{
//   const token = req.cookies?.token;
//   console.log('value of token at middleware', token);
//   if(!token){
//     return res.status(401).send({message: 'unauthorized access'})
//   }

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, decoded) =>{
//     if(err){
//       return res.status(401).send({message: ('unauthorized access')})
//     }
//     //if token is valid
//     req.user =decoded;
//     next()
//   })
// }

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ynzghe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const cookieOption = {
  httpOnly:true,
  semeSite:process.env.NODE_ENV === 'production' ? 'none': 'strict',
  secure: process.env.NODE_ENV === 'production' ? true : false,
 }

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db('carDoctor').collection('services');
    const bookingCollection = client.db('carDoctor').collection('bookings');



//auth related api
    app.post('/jwt',logger, async(req, res) =>{
      const user = req.body;
      console.log(user);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '1h'})
     res
     .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

  })
    .send({success: true});
    })

    app.post('/logout', async(req, res) => {
      const user = req.body;
      console.log('logging out ', user);
      res.clearCookie('token', {...cookieOption, maxAge: 0}).send({success: true});
    })


// service related api 
    app.patch('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const upadatedBooking = req.body;
      console.log(upadatedBooking);
      const updateDoc = {
        $set : {
          status: upadatedBooking.status
        },

      };
      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.delete('/bookings/:id', async(req, res) =>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    })
//bookings
    app.get('/bookings', logger, verifyToken, async(req, res) =>{
      console.log(req.query.email);
      // console.log('tok tok token', req.cookies.token)
     console.log('user in the valid token', req.user)
     if(req.query.email !== req.user.email){
      return res.status(403).send({message: 'forbidden access'})
     }
     
      let query = {};
      if(req.query?.email){
        query = {
          email:req.query.email
        }
      }
      const result=  await bookingCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/bookings', async(req, res) =>{
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);

    })

    app.get('/services',logger,  async(req, res) =>{
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/servicing/:id', async(req, res) => {
     const id = req.params.id;
     const query = { _id: (id) }
        
      const options = {
          
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1, service_id: 1, img: 1 },
      };
      const result = await serviceCollection.findOne(query, options);
     
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car genius is running')
})

app.listen(port, () => {
  console.log(`Car genius is running on port: ${port}`)
})