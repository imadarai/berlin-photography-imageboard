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
        'SELECT url, title, description FROM images',
    );
};
