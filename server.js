const express = require('express');
const multer = require("multer");
const app = express();
const fs = require('fs');
const SERVER_PORT = 5000;


app.listen(SERVER_PORT, () => {
    console.log(" listening on port  ! " + SERVER_PORT);
});


// Server the front ressources
app.use(express.static("front-end"));
// Facilitates reading requests
app.use(express.urlencoded());
app.use(express.json());


let posts = JSON.parse(fs.readFileSync('post.json'));
console.log(posts);


// Days of the week
let weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

// Months of the year
let month = new Array(12);
month[0] = 'January';
month[1] = 'February';
month[2] = 'March';
month[3] = 'April';
month[4] = 'May';
month[5] = 'June';
month[6] = 'July';
month[7] = 'August';
month[8] = 'September';
month[9] = 'October';
month[10] = 'November';
month[11] = 'December';


const myMulter = multer({
    dest: "./front-end/images",
});


// POST image
let imgLink = '';
app.post('/post/image', myMulter.single('file'), (req, res) => {
    let oldpath = req.file.path;
    let newpath = "./front-end/images/" + req.file.originalname;
    fs.rename(oldpath, newpath, (err) => {}); 

    imgLink = req.file.originalname;
    res.send(imgLink);
});


// GET Method
app.get('/post', (req, res) => {
    res.send(posts);
});


// POST Method
app.post('/post', (req, res) => {
    let author_name = req.body.author_name;
    let content = req.body.content;

    let today = new Date();
    let date = weekday[today.getDay()] + ' ' + today.getDate() + ', ' + month[today.getMonth()] + ', ' + ' At ' + today.getHours() + ':' + today.getMinutes();
    
    let countId = 1;
    if (posts.length > 0){
        countId += parseInt(posts[0].id);
    };

    let newPost = { 
        "id": countId,
        "author_name": author_name,
        "img": imgLink,
        "date": date,
        "content": content,
    };

    posts.unshift(newPost);

    fs.writeFileSync('post.json', JSON.stringify(posts));
    res.send(posts);
});


// PUT Method
app.put('/post/:id', (req, res) => {
    let id = req.params.id;
    let author_name = req.body.author_name;
    let content = req.body.content;
    let img = req.body.img;
    // FindIndex()
    let index = posts.findIndex(post => post.id === parseInt(id));
    if (index >= 0) {
        let post = posts[index];
        post.author_name = author_name;
        post.content = content;
        post.img = img;
        fs.writeFileSync('post.json', JSON.stringify(posts));
        res.send([post]);
    } else {
        res.status(404)
        res.send({error: "Post id not found"})
    }
});


// DELETE Method
app.delete('/post/:id', (req, res) => {
    let id = req.params.id;
    let index = posts.findIndex(post => post.id === parseInt(id));
    if (index >= 0) {
        posts.splice(index, 1);
        fs.writeFileSync('post.json', JSON.stringify(posts));
        res.send({message: "Successfully deleted"});
    } else {
        res.status(404)
        res.send({error: "Post id not found"});
    }
});