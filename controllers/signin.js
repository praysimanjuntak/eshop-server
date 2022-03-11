const jwt = require('jsonwebtoken')

const handleSignIn = async (db, bcrypt, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('incorrect form submission');
    }

    try {
        const dbPass = 
            await db.select('email', 'hash')
            .from('signin')
            .where('email', '=', email);
        const isValid = await bcrypt.compare(password, dbPass[0].hash);
        if (isValid) {
            return db.select('*').from('accounts')
                .where('email', '=', email)
                .then(user => user[0])
                .catch(error => Promise.reject('Unable to get user'));
        } else {
            Promise.reject('Invalid credentials');
        }
    } catch {
        Promise.reject('Invalid credentials');
    }
    
}

const getAuthTokenEmail = (req, res, db) => {
    const { authorization } = req.headers;
    return db.select('*').from('session2').where('session', '=', authorization)
        .then(result => {
            if (result.length === 0) {
                return res.status(400).json('Unauthorized')
            }
            return res.json({ email: result[0].email });
        })
}

const signToken = (email) => {
    const jwtPayload = { email };
    return jwt.sign(jwtPayload, 'eshop', { expiresIn: '2 days' });
}

const setToken = async (email, session, db) => {
    try {
        await db('session2').insert({
                email: email,
                session: session
            })
            .onConflict('email')
            .merge()
        return Promise.resolve('Successful insert');
    } catch (err) {
        console.log(err);
        return Promise.reject('Unsuccessful insert');
    }
    
}

const createSession = (user, db) => {
    const { email } = user;
    const token = signToken(email);
    return setToken(email, token, db)
        .then(() => {
            return { success: 'true', email: email, token }
        })
}

const handleAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;

    return authorization ? getAuthTokenEmail(req, res, db) :
        handleSignIn(db, bcrypt, req, res)
            .then(data => {
                return data.email ? createSession(data, db) : Promise.reject('');
            })
            .then(session => {
                res.json(session)
            })
            .catch(err => res.status(400).json(err));
}

module.exports = {handleAuthentication}