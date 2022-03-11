const handleStoreCart = (db) => async (req, res) => {
    let { carts, email } = req.body;
    if (!carts || !email) {
        return res.status(400).json("Incorrect insertion");
    }

    await db('cart').where('email', email).del()
    .then(() => {
        for (const item of carts) {
            const newCart = {
                email: email,
                item_id: item.item_id,
                amount: item.amount
            }
            db('cart').insert(newCart)
            .catch(console.log)
        }
    })
    .then(() => {
        res.json('success')
    })
    .catch(error => {
        console.log(error);
        res.status(400).json('Unable to insert');
    });
}

module.exports = {handleStoreCart}