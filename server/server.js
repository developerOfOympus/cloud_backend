const bodyParser = require('body-parser');
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./src/routes/routes'));
app.get('/', (req, res)=>{
    res.json({
        "mess":"hola"
    })
})

app.listen(port, (err)=>{
    if(err){
        throw new Error("Failed to run server");
    }

    console.log("Listening at port", port);
});