import axios from "axios";
import { ProductModel } from "../models/models.mjs";
const processRecordsInBatch = async (bulkRecords, errors) => {
  //process in batch size of 100
  const batchSize = 100;
  for (let i = 0; i < bulkRecords.length; i += batchSize) {
    const batch = bulkRecords.slice(i, i + batchSize);
    console.log("processing: ", JSON.stringify(batch));

    // pre-validate each product and filter out any product that have invalid fields
    const validProducts = batch.filter((product, indx) => {
      const record = product.updateOne.update;

      //validateSync validates against validation defined in ProductModel?
      const validationError = new ProductModel(record).validateSync();
      if (validationError) {
        const errorMsg = `Invalid record at line ${indx + 2} ${
          validationError.message
        }`;
        errors.push(errorMsg);
        console.log(errorMsg);
      }
      return !validationError;
    });

    const result = await ProductModel.bulkWrite(validProducts);
    console.log("process result: ", result);
  }
};

const sendProcessingStatsToSlack = async (
  vendorName,
  processor,
  totalRecords,
  errors
) => {
  let message = `================================================================================\n${vendorName} - *${processor}* results\n*Total records:* ${totalRecords} \n*Success records:* ${
    totalRecords - errors.length
  } \n*Error records:* ${errors.length} \n*Error details:* \n`;

  errors.forEach((error) => {
    message += `${error} \n`;
  });

  message +=
    "================================================================================";
  const response = await axios.post(
    "https://hooks.slack.com/services/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",
    { text: message },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("slack response:", response.data);
};

export { processRecordsInBatch, sendProcessingStatsToSlack };
