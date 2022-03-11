const handleDeleteCart = (db) => async (req, res) => {
    let { email } = req.body;
    if (!email) {
        return res.status(400).json('Incorrect deletion');
    }

    await db('cart').where('email', email).del()
    .then(() => {
        res.json('deletion success')
    })
    .catch(err => {
        console.log(error);
        res.status(400).json('Unable to delete');
    })
}

module.exports = {handleDeleteCart}