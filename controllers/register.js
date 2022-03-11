const handleRegister = (db, bcrypt, saltRounds) => async (req, res) => {
    const trx = await db.transaction();
    let { email, name, password } = req.body;
    console.log(req.body);
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = {
        email: email,
        name: name,
        joined: new Date()
    }   
    
    await trx('accounts').insert(newUser)
    .then(() => {
        console.log('1')
        return trx('signin').where('email', email).insert({
            email: email,
            hash: hash
        })
    })
    .then(() => {
        trx.commit();
        db.select('*').from('accounts')
            .where('email', email)
            .then(user => {
                console.log('2')
                console.log(user)
                res.json(user[0])
            })
    })
    .catch(error => {
        trx.rollback();
        console.log(error)
        res.status(400).json('Unable to register 2');
    });
}

module.exports = {handleRegister}