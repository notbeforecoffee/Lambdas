import DataProcessor from "./data-processor.mjs";
import { VendorModel } from "../models/models.mjs";
import { transform } from "../transformer/transform-mapping.mjs";
import { processRecordsInBatch, sendProcessingStatsToSlack } from "./common-data-processor.mjs";

class InventoryDataProcessor extends DataProcessor {
  async process(inventoryData) {
    console.log("inventory data processors process method");
   
    const { data, mapping } = inventoryData;
    const { vendorName, inventoryDataCsvMapping } = mapping;
   
    const records = transform(data, inventoryDataCsvMapping);
    const query = { name: { $regex: new RegExp("^" + vendorName + "$", "i") } };
    console.log("query:", query);
    
    const vendor = await VendorModel.findOne(query).exec();
    console.log("vendor in database ", vendor);
    
    if (!vendor) {
      console.log(`vendor ${vendorName} not found in database`);
      return;
    }

    const { _id } = vendor;


    const bulkRecords = records.map((record) => ({
      updateOne: {
        filter: { sku: record.sku, vendor: _id },
        update: {
          ...record,
          vendor: _id,
        },
        upsert: true,
      },
    }));
    const errors = [];
    // Look at doing this through product service - would need to be a patch route, as this only updates four or so fields
    await processRecordsInBatch(bulkRecords, errors);
    await sendProcessingStatsToSlack(vendorName, "Inventory Data Processor", bulkRecords.length, errors);
  }
}

export default InventoryDataProcessor;
