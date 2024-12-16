import { Schema, model } from 'mongoose';
import { TVendor, VendorModel } from './vendor.type';

const vendorSchema = new Schema<TVendor, VendorModel>(
  {
    name: {
      type: String,
      required: [true, 'Vendor name is required'],
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

export const Vendor = model<TVendor, VendorModel>('Vendor', vendorSchema);
