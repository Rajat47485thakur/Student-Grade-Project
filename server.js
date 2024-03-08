const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');


const app = express();
const port = 8000;
const url = 'mongodb://localhost:27017/GreadCard';
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`Connected to ${url}`)
    })
    .catch(error => console.log(`Error connecting to  ${url}:${error}`));

app.use(express.json());
app.use('/', routes);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});