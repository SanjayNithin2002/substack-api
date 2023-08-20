const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Users = require('../models/Users');
const authenticate = require('../middleware/authenticate');

router.get('/', authenticate, (req, res) => {
    Users.find()
        .select('_id name email password')
        .exec()
        .then(users => {
            res.status(200).json({
                users: users.map(user => ({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    request: {
                        type: 'GET',
                        url:  process.env.URL + '/users/' + user._id
                    }
                }))
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:id', authenticate, (req, res) => {
    Users.findById(req.params.id).select('_id name email password').exec()
        .then(user => {
            res.status(200).json({
                user: user,
                request: {
                    type: 'GET',
                    url: process.env.URL + '/users/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/signup', (req, res) => {
    const user = new Users({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
        .then(user => {
            res.status(201).json({
                message: 'User saved successfully!',
                user: user
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    Users.find({ email: email }).exec()
        .then(docs => {
            if (docs.length === 0) {
                res.status(404).json({
                    error: 'User Not Found'
                })
            } else {
                if (docs[0].password === password) {
                    const token = jwt.sign({
                        email: docs[0].email,
                        id: docs[0]._id
                    },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        });
                    res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                else {
                    res.status(401).json({
                        message: 'Auth failed'
                    })
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/:id', authenticate, (req, res) => {
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Users.findByIdAndUpdate(req.params.id, updateOps).exec()
        .then(user => {
            res.status(200).json({
                message: 'User patched successfully!',
                user: user
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:id', authenticate, (req, res) => {
    Users.findById(req.params.id).exec()
        .then(user => {
            console.log(req.userData)
            if(user.email !== req.userData.email){
                res.status(401).json({
                    message: 'Auth failed'
                });
            }
            else{
                Users.findByIdAndDelete(req.params.id).exec()
                .then(user => {
                    res.status(200).json({
                        message: 'User deleted successfully!',
                        user: user
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;