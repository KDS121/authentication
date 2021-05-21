const dotenv = require('dotenv');
const express =  require('express');
const app = express();

dotenv.config({path: './config.env'});
require('./db/conn');
app.use(express.json());
app.use(require('./routes/auth'));

// const User = require('./model/userSchema');



//PORT
const PORT = process.env.PORT; 
app.get('/', (req,res) => {
    res.send('Hello world from server');
});
// app.get('/about',(req,res) => {
//     res.send('Hello world from about server');
// });
app.get('/contact', (req,res) => {
    res.send('Hello world from contact server');
});
app.get('/signin', (req,res) => {
    res.send('Hello world from signin server');
});
app.get('/signup', (req,res) => {
    res.send('Hello world from signup server');
});


app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`);
})