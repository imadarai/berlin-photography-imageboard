const aws = require('aws-sdk');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});


exports.upload = (req, res, next) => {
    //check to see if a file was passed to this function
    if (!req.file){
        console.log("No File passed to S3 function");
        return res.sendStatus(500);
    } else {
        //desstructuring
        const {filename, mimetype, size, path} = req.file;
        //call to Amazon S3 services to upload Image File
        const promise = s3.putObject({
            Bucket: "imageboardbyimad",
            ACL: 'public-read',
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size
        }).promise();

        promise.then(() => {
            console.log("image made it to amazon web services!");
            next();
            // fs.unlink(path, () => {});
        }).catch( err => {
            console.log("Err in putObject of s3.js: ", err);
            res.sendStatus(500);
        });
    }
};
