const dotenv = require('dotenv');
const AWS = require('aws-sdk');

dotenv.config();

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_KEY,
  secretAccessKey: process.env.IAM_SECRET,
  region: process.env.AWS_REGION
});

// Upload to S3
exports.uploadToS3 = (data, filename) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  };

  return s3.upload(params).promise(); // returns a promise
};
