const requireAuth = (db) => (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unauthorized');
    }

    return db.select('*').from('session2').where('session', '=', authorization)
        .then(result => {
            if (result.length === 0) {
                return res.status(401).json('Unauthorized');
            }

            return next();
        })
        .catch(console.log);
}

module.exports = {requireAuth}