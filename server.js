const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');

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
      host : 'learningbuddy.cdfxjommi3zh.ap-southeast-1.rds.amazonaws.com',
      user : 'admin',
      password : 'kucingmeong',
      database : 'learningbuddy'
    }
});

const app = express();
app.use(helmet());
app.use(bodyParser.json());

// const whitelist = ['http://localhost:3000']
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
app.use(cors())

app.get('/', (req, res) => { res.send('Working') });
app.post('/sign-in', signin.handleAuthentication(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt, saltRounds));
app.get('/get-item', getItem.handleGetItems(db));
app.post('/get-cart', cart.handleGetCart(db));
app.post('/store-cart', storeCart.handleStoreCart(db));
app.get('/get-particular/:email', auth.requireAuth(db), getParticular.handleGetParticular(db));
app.post('/delete-cart', deleteCart.handleDeleteCart(db));

PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})