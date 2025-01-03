import { Model } from 'mongoose';

export type TCompany = {
  _id?: string;
  name: string;
  logo: string;
  website: string;
};

export type CompanyModel = Model<TCompany>;
