const handleGetCart = (db) => async (req, res) => {
    let { email } = req.body;
    await db.select('item_id', db.raw('SUM(amount) as amount'))
        .from('cart').groupBy('item_id')
        .where('email', '=', email)
        .then(data => res.json(data))
        .catch(error => {
            console.log(error);
            res.status(400).json('Unable to get cart');
        })
}
module.exports = {handleGetCart}