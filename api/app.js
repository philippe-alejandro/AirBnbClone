const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const CookieParser = require('cookie-parser');
const cookieParser = require('cookie-parser');
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require('fs');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'dgfbdfgshndgjgfyhgdfhjgr';

if (!bcryptSalt) {
  throw new Error('Failed to generate bcrypt salt');
}

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(cors({
  credentials: true, 
  origin: ['http://localhost:3000', 'http://192.168.18.5:3000']
}));

mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
  // console.log('test ok log');
  res.json('test ok');
});

app.post('/register', async (req, res) => {
  console.log(req.headers['content-type']);
  console.log(req.body);
  const contentType = req.headers['content-type'];
  if (contentType && contentType.indexOf('application/json') !== -1) {
    // content type is application/json
    const { name, email, password } = req.body;
    try {
      const userDoc = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcryptSalt)
      });
      console.log('User created:', userDoc);
      res.json(userDoc);
    } catch(e) {
      console.log('Error:', e);
      res.status(422).json(e);
    }
  } else {
    // content type is not application/json
    res.status(400).json({ error: 'Content-Type must be application/json' });
  }
});

// this code is executed when a post request using axios is made to the endpoint
// '/login'. 
app.post('/login', async (req, res) => {
  // the credentials are destructured from the requests' body. 
  const { email, password } = req.body;
  // the given email in the request's body is used to search for the user in the 
  // database. 
  const userDoc = await User.findOne({email});
  // if user is found, then the following code executes. 
  if (userDoc) {
    // the password from the retrieved 'doc' is compared to the one 
    // provided by the user. 
    const passOK = bcrypt.compareSync(password, userDoc.password);
    // if passwords match, then the following happens. 
    if (passOK) {
      // the first argument is the payload of the token. The second argument is the 'secret key'
      // to sign the token and approve it. Third: object where further configuration can be made. 
      // Fourth: callback function to be executed once the signing process is finished. 
      jwt.sign({ 
        email:userDoc.email, 
        id:userDoc._id }, jwtSecret, {}, (err, token)=>{
        if (err) throw err;
        // the cookie being returned is a token and the second argument is the value of the token.
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not OK');
    }
  } else {
    console.log("user doesn't exist");
    res.json('not found');
  }
});

app.get('/profile', (req, res) => {
  // destructures or selects the 'token' property from the 'cookies' property inside
  // the 'req' object. 
  const { token } = req.cookies;
  //check existence of the 'token'
  if (token) {
    // token verification process. This checks if token has expired and if the user has 
    // the necessary permissions to access the endpoint.  
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      // checks if an error is encountered 
      if (err) throw err;
      // selects properties from a specific user document in the 'User' collection
      // from MongoDB. The user if searched for using the 'id' of the document. 
      const { name, email, _id } = await User.findById(userData.id);
      // the response is an object with the user's data. 
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

// the response for this request is an empty token which no longer contains
// a header, payload, and signature. Therefore, the user no longer has access
// to resources. 
app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true)
})

app.post('/upload-by-link', async (req, res) => {
  const {link} = req.body;
  const newName = Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path, originalname} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace('uploads/', ''));  
  }
  res.json(uploadedFiles);
});

app.post('/places', (req, res) => {
  // in the request made there's a property called cookies.
  // The "token" property from that object is taken. 
  const { token } = req.cookies;
  // all of these values are destructured from the "body" of the request. 
  const {title, address, addedPhotos, description, perks, 
    extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
  // token verification process is conducted to see if a new accomodation
  // can be created in the MongoDB colletion. If the token hasn't expired
  // and the signature is valid then the newly created accomodation is returned. 
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id, title, address, photos: addedPhotos, 
      description, perks, extraInfo, checkIn, checkOut, 
      maxGuests, price
    });
    res.json(placeDoc);
  });
});

app.get('/user-places', (req, res) => {
  const { token } = req.cookies;
  // this verifies the JSON web token. It checks the payload and the signature.
  // the token is verified by using the "jwtSecret" string and also is used 
  // to sign the token. 
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    // if there are no issues with the verification, then the userData
    // is returned and the id from such object is used to filter the 
    // Place collection in MongoDB and simply get all accomodations created
    // by a specific user. 
    const { id } = userData;
    res.json(await Place.find({owner:id}));
  });
});

// this get request returns the data of a specific property created
// by any user. This request is made from the "IndexPage" component and
// also from the "PlacePage" component. 
app.get('/places/:id', async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

// this request allows users to modify the accomodations they have created. 
app.put('/places', async (req, res) => {
  // token is selected from the request made to be later verified. 
  const { token } = req.cookies;
  // several properties are selected from the request body. 
  const {id, title, address, addedPhotos, description, perks, 
    extraInfo, checkIn, checkOut, maxGuests, price} = req.body;
  // the token is verified and jwtSecret makes sure the token hasn't been 
  // tampered with. jwtSecret creates the signature in the token's payload. 
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    // the "Place" collection is filtered using the id property from the 
    // body of the request. 
    const placeDoc = await Place.findById(id);
    // the user id in the userData is compared to that located in the document
    // of the accomodation. If they match, the new values are added and the 
    // updated doc is saved. 
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description, perks, 
        extraInfo, checkIn, checkOut, maxGuests, price
      })
      await placeDoc.save();
      res.json('ok');
    }
  });
});

// route used to get all places in the "Place" collection in the MongoDB database.
app.get('/places', async (req, res) => {
  res.json(await Place.find());
});

app.post('/bookings', async (req, res) => {
  const userData = await getUserDataFromToken(req);
  // console.log("userData:", userData);
  const { place, checkIn, checkOut, 
    numberOfGuests, name, phone, price } = req.body;
  //console.log(place, checkIn, checkOut, numberOfGuests, name, phone, price);
  Booking.create({
    place, checkIn, checkOut, 
    numberOfGuests, name, phone, price, user: userData.id
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});

function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    })
  });
}

app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromToken(req);
  const bookings = await Booking.find({user:userData.id}).populate('place');
  res.json(bookings);
})

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

