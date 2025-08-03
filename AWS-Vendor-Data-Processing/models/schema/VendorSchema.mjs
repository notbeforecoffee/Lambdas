import { Schema } from "mongoose";

const VendorSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Vendor name is required"],
    },
    mID: {
      type: String,
      trim: true,
      default: null,
    },
    logoURL: {
      type: String,
      required: [true, "Vendor logo url is required"],
    },
    address: {
      type: String,
      trim: true,
      required: [true, "Vendor address is required"],
    },
    region: {
      type: String,
      trim: true,
      required: [true, "Vendor region is required"],
    },
    geoCoordinate: {
      type: { type: String },
      coordinates: [],
    },
    state: {
      type: String,
      trim: true,
    },
    stateCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    countryCode: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    onboardedDate: {
      type: Date,
      default: null,
    }
  },
  { collection: "vendors", minimize: false, timestamps: true }
);
export default VendorSchema;