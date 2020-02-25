const express = require('express');
const app = express();
const database = require('./public/js/db.js');



////////////////////////////////////////////////////////////////////////////////
//                              STATIC to read HTML                           //
// /////////////////////////////////////////////////////////////////////////////
//This serves all my html, css, js requests
app.use(express.static('./public'));


////////////////////////////////////////////////////////////////////////////////
//                                 GET ROUTES                                 //
// /////////////////////////////////////////////////////////////////////////////
app.get('/getImages', (req, res) => {;
    //Database call to get Images URL, Title and Description
    database.getImages().then( results => {
        //setting results.rows to a variable
        let imagesData = results.rows;
        //returning data object
        return res.json(imagesData);
    }).catch(err => console.log("Err in getImages() on server side : ", err));
});



//any routes are just for info/data ...
if (require.main === module){
    app.listen(process.env.PORT || 8080, () => console.log("Image Board Server is up!"));
}
