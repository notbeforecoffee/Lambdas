const AWS = require ('aws-sdk');
const s3 = new AWS.S3();
const fileType = require ('file-type');
const validator = require ('validator');

const uploadToS3 = async (payload) => {
  const { image, fileName, bucketName } = payload

  
  return new Promise((resolve, reject) => {
    try {

        if (image.startsWith('http'))
     
        resolve({
            success: true,
            message: 'Image is already a url',
            url: image,
          });
    
      const formattedBase64 = image.split(';base64,'); //format if base64 data url
      const base64String = formattedBase64[formattedBase64.length - 1];
    
      if (!validator.isBase64(base64String))
        return {
          success: false,
          message: 'File is not a base64 data url',
        };
    
      const uploadFileBuffer = Buffer.from(base64String, 'base64');
    
      if (!uploadFileBuffer)
        return {
          success: false,
          message: 'File type not compatible',
        };
    
      const mimeType = image.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
      let ext = mimeType.split('/')?.[1];
      ext = ext.split('+')?.[0] ?? ext;
 
      const params = {
        Bucket: bucketName,
        Key: `${fileName.split(' ').join('_')}.${ext}`,
        Body: uploadFileBuffer,
      };
      s3.upload(params, function (error, data) {
        if (error) {
          resolve({
            success: false,
            message: error.message,
          });
        }

        resolve({
          success: true,
          message: 'Image uploaded',
          url: data.Location,
        });
      });
    } catch (error) {
      resolve({
        success: false,
        message: error.message,
      });
    }
  });
};
exports.handler = uploadToS3;