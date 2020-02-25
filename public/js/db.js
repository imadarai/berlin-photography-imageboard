const spicedPg = require('spiced-pg');
// const secrets = require('./secrets');

///////////////////////////////////////////////////////////////////////////////
//                 DATABASE PORTS FOR LOCAL AND HEROKU                       //
///////////////////////////////////////////////////////////////////////////////

const db = spicedPg(process.env.DATABASE_URL || `postgres://postgres:postgres@localhost:5432/imageboard`);

///////////////////////////////////////////////////////////////////////////////
//               DATABASE REQUEST FOR --- SIGNATURE TABLE                    //
///////////////////////////////////////////////////////////////////////////////
module.exports.getImages = function () {
    return db.query(
        `SELECT * FROM images
        ORDER BY created_at DESC
        LIMIT 9`,
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
