const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Users = require('../models/Users');

router.get('/', (req, res) => {
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
                        url: 'http://localhost:3000/users/' + user._id
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

router.get('/:id', (req, res) => {
    Users.findById(req.params.id).select('_id name email password').exec()
        .then(user => {
            res.status(200).json({
                user: user,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/users/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res) => {
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

router.patch('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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
});

module.exports = router;