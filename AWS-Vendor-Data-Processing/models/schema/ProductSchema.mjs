import { Schema } from 'mongoose';

const productStatusEnum = ["Active", "Discontinued", "New",]

const ProductSchema = new Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'vendors',
      required: [true, 'Vendor ID is required'],
    },
    name: {
      type: String,
      trim: true,
    },
    imageURLs: {
      type: Array,
    },
    lifeStyleImageURLs: {
      type: Array,
    },
    sku: {
      type: String,
      trim: true,
      required: [true, 'product sku is required'],
    },
    link: {
      type: String,
      trim: true,
      default: null
    },
    weight: {
      type: Number,
      trim: true,
      default: null
    },
    weightUnit: {
      type: String,
      trim: true,
      default: null
    },
    dimension: {
      type: String,
      trim: true,
      default: null
    },
    length: {
      type: Number,
      default: null,
    },
    width: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    dimensionUnit: {
      type: String,
      trim: true,
    },
    tradePrice: {
      type: Number,
      default: null
    },
    msrp: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      trim: true,
      default: null
    },
    category: {
      type: String,
      trim: true,
      default: null,
    },
    fulhausCategory: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      trim: true,
      default: null,
      required: false
    },
    colorName: {
      type: String,
      trim: true,
      default: null,
    },
    material: {
      type: String,
      trim: true,
      default: null,
    },
    variants: {
      type: String,
      trim: true,
      default: null,
    },
    stockQty: {
      type: Number,
      default: 0,
    },
    casePackQty: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    warrantyInfo: {
      type: String,
      trim: true,
      default: null,
    },
    careInfo: {
      type: String,
      trim: true,
      default: null,
    },
    map: {
      type: Number,
      default: 0,
    },
    restockDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: productStatusEnum,
    },
  },
  { collection: 'products', minimize: false, timestamps: true }
);

export default ProductSchema;
