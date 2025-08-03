import DataProcessor from './data-processor.mjs';
import { VendorModel } from '../models/models.mjs';
import { transform } from '../transformer/transform-mapping.mjs';
import {
  processRecordsInBatch,
  sendProcessingStatsToSlack,
} from './common-data-processor.mjs';

class ProductDataProcessor extends DataProcessor {
  async process(productData) {
    console.log('product data processors process method');
    const { data, mapping } = productData;
    const { csvColumnMapping, categoryMapping, vendorName } = mapping;
    const transformedRecords = transform(data, csvColumnMapping);
    //updating records to upper case currency
    const records = transformedRecords.map((record) => {
      if (!record.currency) {
        return record;
      }
      
      // if (record.tradePrice) record.retailPrice = record.tradePrice * 2;

      return { ...record, stockDate: new Date(), currency: record.currency?.toUpperCase() };
    });

    //extracting the vendor from the database, to acquire the id
    //Regex used to make vendor name case-insensitive
    const query = { name: { $regex: new RegExp('^' + vendorName + '$', 'i') } };
    console.log('query:', query);
    const vendor = await VendorModel.findOne(query).exec();
    console.log('vendor in database ', vendor);
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
          $setOnInsert: {
            fulhausCategory: categoryMapping[record.category] || undefined //Only sets this category assignment if this is a new product.  This prevents it from being changed back to vendor category assignment, if we have manually changed it
          },
        },
        upsert: true,
      },

    }));

    const errors = [];
     //convert this to call endpoint in product service, to update database?
    await processRecordsInBatch(bulkRecords, errors);
    await sendProcessingStatsToSlack(
      vendorName,
      'Product Data Processor',
      bulkRecords.length,
      errors
    );
  }
}

export default ProductDataProcessor;
