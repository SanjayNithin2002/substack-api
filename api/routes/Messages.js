const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const mongoose = require('mongoose');
const Messages = require('../models/Messages');

router.get('/', authenticate, (req, res) => {
    Messages.find().populate('user').exec()
        .then(messages => {
            res.status(200).json({
                messages: messages.map(message => {
                    return {
                        message: message,
                        request: {
                            type: 'GET',
                            url: process.env.URL + '/messages/' + message._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:id', authenticate, (req, res) => {
    Messages.findById(req.params.id).populate('user').exec()
        .then(message => {
            res.status(200).json({
                message: message,
                request: {
                    type: 'GET',
                    url: process.env.URL + '/messages/'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.get('/users/:id', authenticate, (req, res) => {
    Messages.find({ user: req.params.id }).populate('user').exec()
        .then(messages => {
            res.status(200).json({
                messages: messages.map(message => {
                    return {
                        message: message,
                        request: {
                            type: 'GET',
                            url: process.env.URL + '/messages/' + message._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', authenticate, (req, res) => {
    const message = new Messages({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.user,
        postedOn: req.body.postedOn? req.body.postedOn : new Date().toJSON().slice(0, 10),
        content: req.body.content

    });
    message.save()
        .then(message => {
            res.status(201).json({
                message: 'Message saved successfully!',
                messages: message
            });
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
    Messages.findByIdAndUpdate(req.params.id, updateOps).exec()
        .then(message => {
            res.status(200).json({
                message: 'Message patched successfully!',
                messages: message
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:id', authenticate, (req, res) => {
    Messages.findByIdAndDelete(req.params.id).exec()
        .then(message => {
            res.status(200).json({
                message: 'Message deleted successfully!',
                messages: message
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;