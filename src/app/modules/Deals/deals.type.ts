import { Model, Schema } from 'mongoose'


export type TDealType = 'cashback' | 'giftcard' | 'creditcard';

export type TDeal = {
  _id: string;
  title: string;
  percentage: number;
  type: TDealType;
  vendorId: Schema.Types.ObjectId
  companyId: Schema.Types.ObjectId
  expiryDate: Date;
  link: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type DealModel = Model<TDeal>;
