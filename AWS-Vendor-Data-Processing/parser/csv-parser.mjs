import AWS from "aws-sdk";
import csv from "csvtojson";


// const accessKeyId = "";
// const secretAccessKey = "";

AWS.config.update({
  region: "us-east-2",
//  accessKeyId,
//  secretAccessKey
});
const S3 = new AWS.S3();

export const csvToJSON = async (bucketName, filePath) => {
  const params = {
    Bucket: bucketName,
    Key: filePath,
  };
  const stream = S3.getObject(params).createReadStream();

  const json = await csv().fromStream(stream);
  return json;
};

export const readMappingFileFromS3 = async (bucketName, filePath) => {
  const params = {
    Bucket: bucketName,
    Key: filePath,
  };
  const data = await S3.getObject(params).promise();

  return data.Body.toString("utf-8");
};
