import { model } from "mongoose";
import ProductSchema from "./schema/ProductSchema.mjs";
import VendorSchema from "./schema/VendorSchema.mjs";

export const ProductModel = model("products", ProductSchema);
export const VendorModel = model("vendors", VendorSchema);