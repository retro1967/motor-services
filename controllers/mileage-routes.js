const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('add-mileage', {loggedIn: true});
});

module.exports = router;