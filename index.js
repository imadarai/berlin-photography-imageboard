const express = require('express');
const app = express();
const database = require('./db.js');
const s3 = require("./s3.js");
const config = require("./config.json");

///////////////////////////////////////////////////////////////////////////////
//                FILE UPLOAD BOILERPLATE CODE WITH MULTER                   //
// /////////////////////////////////////////////////////////////////////////////
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
////////////////////////////////////////////////////////////////////////////////
//                              STATIC to read HTML                           //
// /////////////////////////////////////////////////////////////////////////////
//This serves all my html, css, js requests
app.use(express.static('./public'));
app.use(express.json());


////////////////////////////////////////////////////////////////////////////////
//                                 GET ROUTES                                 //
// /////////////////////////////////////////////////////////////////////////////
// ----------------------------- GET ALL IMAGES ------------------------------//
app.get('/getImages', (req, res) => {
    //Database call to get Images URL, Title and Description
    database.getImages().then( results => {
        //setting results.rows to a variable
        let imagesData = results.rows;
        //returning data object
        return res.json(imagesData);
    }).catch(err => console.log("Err in getImages() on server side : ", err));
});
// --------------------------- GET IMAGE BY ID ------------------------------//
app.get ("/getImageById/:id", (req, res) => {
    //Database call to get an Image data by ID
    database.getImageById(req.params.id).then( imageData => {
        //returning data object to VUE
        return res.json(imageData.rows[0]);
    }).catch(err => console.log("Err in database.getImageById on server side : ", err));
});
// --------------------- GET COMMENTS BY IMAGE ID------------------------------//
app.get("/comments/:id", (req, res) => {
    database.getAllCommentsByImageId(req.params.id)
        .then(function(commentData) {
            return res.json(commentData.rows);
        }).catch(err => console.log("Err in database.getAllCommentsByImageId on server side : ", err));
});
// --------------------- GET MORE IMAGES ON MORE BUTTON-------------------------//
app.get("/load-more-images/:id", (req, res) => {
    let idOfLastImage = req.params.id;
    database.getMoreImages(idOfLastImage).then(response => {
        res.json(response.rows);
    }).catch(err => console.log("Err in database.getMoreImages on server side : ", err));
});
////////////////////////////////////////////////////////////////////////////////
//                                 POST ROUTES                                //
// /////////////////////////////////////////////////////////////////////////////
// ----------------------------- POST AN IMAGE --------------------------------//
app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    // console.log("input: ", req.body);
    // console.log("file", req.file);

    if (req.file) {
        //send file info to database to insert
        database.insertImage(config.s3Url + req.file.filename, req.body.username, req.body.title, req.body.description)
            //catch returning data from db
            .then(function(dataFromDb) {
                // console.log("data being returned from the database is: ", dataFromDb.rows[0]);
                //pass data to VUE
                res.json(dataFromDb.rows[0]);
            }).catch(err => console.log("Err in insertImage DB Call in index.js : ", err));

    } else {
        res.json ({
            success: false
        });
    }
});
// ----------------------------- POST A COMMENT --------------------------------//
app.post("/addcomment", (req, res) => {
    console.log(req.body);
    const {comment, username, image_id} = req.body;
    database.addComment(comment, username, image_id).then(function(data) {
        res.json(data.rows[0]);
    }).catch(err => console.log("Err in /addcomment on server: ", err));
});











//any routes are just for info/data ...
if (require.main === module){
    app.listen(process.env.PORT || 8080, () => console.log("Image Board Server is up!"));
}
