// Helper: Get Vendor ID by Name
import { Vendor } from '../modules/Vendor/vendor.model'
import {Company} from '../modules/Company/company.model'

export const getVendorIdByName = async (name: string): Promise<string | null> => {
  const vendor = await Vendor.findOne({ name });
  return vendor ? vendor._id : null;
};

// Helper: Get Company ID by Name
export const getCompanyIdByName = async (name: string): Promise<string | null> => {
  const company = await Company.findOne({ name });
  return company ? company._id : null;
};