import connectDB from "./config/db.mjs";
import { csvToJSON, readMappingFileFromS3 } from "./parser/csv-parser.mjs";
import DataProcessingContext from "./processor/data-processing-context.mjs";
import EmailInventoryDataProcessor from "./processor/email-inventory-data-processor.mjs";
import InventoryDataProcessor from "./processor/inventory-data-processor.mjs";
import ProductDataProcessor from "./processor/product-data-processor.mjs";

export const handler = async(event) => {
    console.log("File upload event was received.....");
    console.log(JSON.stringify(event));
    const bucket = event.Records[0].s3.bucket.name;
    console.log("bucket: ", bucket);
    // const filePath = event.Records[0].s3.object.key;
    const originalFilePath = event.Records[0].s3.object.key;
    const filePath = sanitizeFilePath(originalFilePath); // Sanitize the file path
    console.log("filePath: ", filePath);
    const vendor = filePath.substring(0, filePath.indexOf("/"));
    const mappingFilePath = `${vendor}/mapping.json`;
    console.log("mapping file: ", mappingFilePath)
    const records = await csvToJSON(bucket, filePath);
    console.log("records after csv parsing", records);
    const mappingFileContent =  await readMappingFileFromS3(bucket, mappingFilePath);
    const mapping = JSON.parse(mappingFileContent);
    const data = {data: records, mapping};
    await connectDB();


    // is the product data processor firing on all inventory files?
    const context = new DataProcessingContext(new ProductDataProcessor());
    if(filePath.includes("/inventory/")){
        context.setStrategy(new InventoryDataProcessor());
    }else if(filePath.includes("/email-inventory/")){
        context.setStrategy(new EmailInventoryDataProcessor());
    }

    await context.processData(data);

    console.log("finished....");
    const response = {
        statusCode: 200,
        body: JSON.stringify('Done!'),
    };
    return response;
};

// Removes spaces and special characters in file names
const sanitizeFilePath= (filePath) => {
    return filePath.replace(/[^a-zA-Z0-9\-_.\/]/g, '');
}

// const event = {
//     "Records": [
//         {
//             "eventVersion": "2.1",
//             "eventSource": "aws:s3",
//             "awsRegion": "us-east-2",
//             "eventTime": "2023-05-24T14:25:30.723Z",
//             "eventName": "ObjectCreated:Put",
//             "userIdentity": {
//                 "principalId": "AWS:AROA2YQ7EJCWIHXGXEF53:lumisource.c7e8ad4af4b99bfc@s-4b69291c1bee41aaa"
//             },
//             "requestParameters": {
//                 "sourceIPAddress": "10.0.155.40"
//             },
//             "responseElements": {
//                 "x-amz-request-id": "43ZSFQ5HCP122W3D",
//                 "x-amz-id-2": "MJRQ1qC3qB1DVwpIOjw6ewJEYhO8GwfSPBK0Wf9636IUk8t3Uc66zIHjfMfPkSrsguypk7D2TKsxSfAxox6/X0JMB4qWF7kLYmUq0XDLWaM="
//             },
//             "s3": {
//                 "s3SchemaVersion": "1.0",
//                 "configurationId": "vendor-data-file-upload-event",
//                 "bucket": {
//                     "name": "fulhaus-vendor-data",
//                     "ownerIdentity": {
//                         "principalId": "A1M5SDHXQV378"
//                     },
//                     "arn": "arn:aws:s3:::fulhaus-vendor-data"
//                 },
//                 "object": {
//                     "key": "yunus/inventory-data.csv",
//                     "size": 99476,
//                     "eTag": "99203eceacd08c75a9805c7a2a4e11cd",
//                     "sequencer": "00646E1E5AAE15F0FB"
//                 }
//             }
//         }
//     ]
// };

// await handler(event);
