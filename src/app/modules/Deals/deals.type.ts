import { Model, Schema } from 'mongoose'

export type TDealType = 'cashback' | 'giftcard' | 'creditcard';

export type TDeal = {
  _id: string;
  title: string;
  percentage: number;
  type: TDealType;
  vendorId: Schema.Types.ObjectId; // Reference to Vendor
  companyId: Schema.Types.ObjectId; // Reference to Company
  expiryDate: Date;
  link: string;
  isActive: boolean; // Whether the deal is currently active
  createdAt?: Date;
  updatedAt?: Date;
};

export type DealModel = Model<TDeal>;
