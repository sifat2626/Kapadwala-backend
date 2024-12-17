import { Vendor } from './vendor.model';
import { TVendor } from './vendor.type';

const createVendor = async (data: TVendor) => {
  const vendor = await Vendor.create(data);
  return vendor;
};

const getAllVendors = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const vendors = await Vendor.find()
    .skip(skip)
    .limit(Number(limit));
  const total = await Vendor.countDocuments();

  return { vendors, total };
};

const getVendorById = async (id: string) => {
  const vendor = await Vendor.findById(id);
  if (!vendor) throw new Error('Vendor not found');
  return vendor;
};

const updateVendor = async (id: string, data: Partial<TVendor>) => {
  const vendor = await Vendor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!vendor) throw new Error('Vendor not found');
  return vendor;
};

const deleteVendor = async (id: string) => {
  const vendor = await Vendor.findByIdAndDelete(id);
  if (!vendor) throw new Error('Vendor not found');
};

export const VendorService = {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
};
