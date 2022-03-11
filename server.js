const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
require('dotenv').config();

const auth = require('./controllers/authorization');
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const cart = require('./controllers/cart');
const storeCart = require('./controllers/storeCart');
const deleteCart = require('./controllers/deleteCart');
const getItem = require('./controllers/getItem');
const getParticular = require('./controllers/getParticular');
const saltRounds = 12;

const db = knex({
    client: 'mysql2',
    connection: {
      host : process.env.DB_ADDRESS,
      user : process.env.DB_ADMIN,
      password : process.env.DB_PASSWORD,
      database : process.env.DB
    }
});

const app = express();
app.use(helmet());
app.use(bodyParser.json());

// const whitelist = ['http://localhost:3000', 'https://eshop-frontend-chi.vercel.app/']
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin !== -1)) {
//             callback(null, true);
//         } else {
//             callback(new Error('not allowed by CORS'))
//         }
//     }
// }

// app.use(cors(corsOptions));
app.use(cors());

app.get('/', (req, res) => { res.send(`Working`) });
app.post('/sign-in', signin.handleAuthentication(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt, saltRounds));
app.get('/get-item', getItem.handleGetItems(db));
app.post('/get-cart', cart.handleGetCart(db));
app.post('/store-cart', storeCart.handleStoreCart(db));
app.get('/get-particular/:email', auth.requireAuth(db), getParticular.handleGetParticular(db));
app.post('/delete-cart', deleteCart.handleDeleteCart(db));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})