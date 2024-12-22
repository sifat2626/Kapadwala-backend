import { Model } from 'mongoose';

export type TVendor = {
  _id?: string;
  name: string;
  logo: string;
  website: string;
};

export type VendorModel = Model<TVendor>;
