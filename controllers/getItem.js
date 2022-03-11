const handleGetItems = (db) => async (req, res) => {
    await db.select('*').from('items')
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            res.status(400).json('Unable to get item')
        })
}
module.exports = {handleGetItems}