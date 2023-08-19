const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const port = process.env.port || 3000;
const userRoutes = require('./api/routes/Users');
const messageRoutes = require('./api/routes/Messages');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/messages', messageRoutes);
app.get("/", (req, res) => {
    res.status(200).json({
        message : "Express server says hello!"
    });
});

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});
app.use((error, req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});