import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

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
  // Check if SLACK_WEBHOOK_URL is configured
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
    return;
  }

  let message = `================================================================================\n${vendorName} - *${processor}* results\n*Total records:* ${totalRecords} \n*Success records:* ${
    totalRecords - errors.length
  } \n*Error records:* ${errors.length} \n*Error details:* \n`;

  errors.forEach((error) => {
    message += `${error} \n`;
  });

  message +=
    "================================================================================";
  
  try {
    const response = await axios.post(
      process.env.SLACK_WEBHOOK_URL,
      { text: message },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("slack response:", response.data);
  } catch (error) {
    console.error('Failed to send Slack notification:', error.message);
  }
};

export { processRecordsInBatch, sendProcessingStatsToSlack };
