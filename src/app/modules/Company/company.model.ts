import { Schema, model } from 'mongoose';
import { TCompany, CompanyModel } from './company.type';

const companySchema = new Schema<TCompany, CompanyModel>(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Company description is required'],
    },
    logo: {
      type: String,
      required: [true, 'Company logo URL is required'],
    },
    website: {
      type: String,
      required: [true, 'Company website URL is required'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

export const Company = model<TCompany, CompanyModel>('Company', companySchema);
