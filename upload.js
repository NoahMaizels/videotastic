const fs = require('fs');
const AWS = require('aws-sdk');
const BUCKET_NAME = 'videotastic'
const ID = 'AKIAIELRDOYWDWBZ4U6A';
const SECRET = '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';
const filename = './README.md'


const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const fileContent = fs.readFileSync(filename);

const uploadFile = (fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: 'README.md', // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          console.log(err)
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  })
};

uploadFile(filename)