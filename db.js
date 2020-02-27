const spicedPg = require('spiced-pg');
// const secrets = require('./secrets');

///////////////////////////////////////////////////////////////////////////////
//                 DATABASE PORTS FOR LOCAL AND HEROKU                       //
///////////////////////////////////////////////////////////////////////////////

const db = spicedPg(process.env.DATABASE_URL || `postgres://postgres:postgres@localhost:5432/imageboard`);

///////////////////////////////////////////////////////////////////////////////
//             DATABASE REQUEST FOR --- GETTING ALL IMAGES                   //
///////////////////////////////////////////////////////////////////////////////
module.exports.getImages = function () {
    return db.query(
        `SELECT * FROM images
        ORDER BY created_at DESC
        LIMIT 12`,
    );
};
///////////////////////////////////////////////////////////////////////////////
//             DATABASE REQUEST FOR --- GETTING IMAGE BY ID                  //
///////////////////////////////////////////////////////////////////////////////
module.exports.getImageById = function (id) {
    return db.query(
        `SELECT *
        FROM images
        WHERE id = $1
        ORDER BY created_at DESC`,
        [id]
    );
};
///////////////////////////////////////////////////////////////////////////////
//             DATABASE REQUEST FOR --- GETTING MORE IMAGES                 //
///////////////////////////////////////////////////////////////////////////////

exports.getMoreImages = function(lastID) {
    return db.query(
        `SELECT *
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 12`,
        [lastID]
    );
};
///////////////////////////////////////////////////////////////////////////////
//           DATABASE REQUEST FOR --- GET ALL COMMENTS BY ID                 //
///////////////////////////////////////////////////////////////////////////////
module.exports.getAllCommentsByImageId = function (id) {
    return db.query(
        `SELECT *
        FROM comments
        WHERE image_id = $1`,
        [id]
    );
};
///////////////////////////////////////////////////////////////////////////////
//           DATABASE REQUEST FOR --- INSERT A COMMENT                       //
///////////////////////////////////////////////////////////////////////////////
exports.addComment = function(comment, username, imageID) {
    return db.query(
        `INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [comment, username, imageID]
    );
};
///////////////////////////////////////////////////////////////////////////////
//               DATABASE REQUEST FOR --- INSERT IMAGE                         //
///////////////////////////////////////////////////////////////////////////////
module.exports.insertImage = function (url, username, title, description) {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, url, username, title, description`,
        [url, username, title, description]
    );
};
