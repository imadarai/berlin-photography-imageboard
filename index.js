const express = require('express');
const app = express();
const database = require('./public/js/db.js');

///////////////////////////////////////////////////////////////////////////////
//                    FILE UPLOAD BOILERPLATE CODE                           //
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


////////////////////////////////////////////////////////////////////////////////
//                                 GET ROUTES                                 //
// /////////////////////////////////////////////////////////////////////////////
app.get('/getImages', (req, res) => {
    //Database call to get Images URL, Title and Description
    database.getImages().then( results => {
        //setting results.rows to a variable
        let imagesData = results.rows;
        //returning data object
        return res.json(imagesData);
    }).catch(err => console.log("Err in getImages() on server side : ", err));
});
////////////////////////////////////////////////////////////////////////////////
//                                 POST ROUTES                                //
// /////////////////////////////////////////////////////////////////////////////
app.post('/upload', uploader.single('file'), (req, res) => {
    console.log("input: ", req.body);
    console.log("file", req.file);

    if (req.file) {
        //make database insert HERE

        //Once successful database has been inserted - send to VUE below
        res.json({
            success: true
        });
    } else {
        res.json ({
            success: false
        });
    }
});











//any routes are just for info/data ...
if (require.main === module){
    app.listen(process.env.PORT || 8080, () => console.log("Image Board Server is up!"));
}
