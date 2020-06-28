const router = require('express').Router();
const { User } = require('../../models');

router.get('/', (req, res) => {
    User.findAll({
        email: req.body.email,
        password: req.body.password,
        miles: req.body.miles
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
    User.create({
      full_name: req.body.full_name,
      email: req.body.email,
      password: req.body.password
    })
      .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.full_name = dbUserData.full_name;
          req.session.loggedIn = true;
  
          res.json(dbUserData);
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'this is where the issue is' });
      })
  });

// Login route to log in to the website
router.post('/login', (req, res) => {
    // expects {email: 'email@mail.com', password: 'password1'}
    User.findOne({
        where: {
          email: req.body.email
        }
    }).then(dbUserData => {
    if (!dbUserData) {
        res.status(400).json({ message: 'No user with that email address!' });
        return;
    }
    // Verify user
    // const validPassword = dbUserData.checkPassword(req.body.password);
    // if(!validPassword){
    //     res.status(400).json({ message: 'Incorrect password!' });
    //     return;
    // }
    res.json({ user: dbUserData, message: 'You are now logged in!' });
    
    });  
});

router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]){
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;