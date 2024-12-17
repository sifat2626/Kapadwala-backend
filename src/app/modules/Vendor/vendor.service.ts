import { Vendor } from './vendor.model';
import { TVendor } from './vendor.type';
import { Deal } from '../Deals/deals.model'

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

const getDealsByVendorName = async (vendorName: string) => {
  // Find the vendor by name
  const vendor = await Vendor.findOne({ name: vendorName });
  if (!vendor) throw new Error('Vendor not found');

  // Fetch all deals related to this vendor
  const deals = await Deal.find({ vendorId: vendor._id })
    .populate('vendorId', 'name logo website') // Populate vendor details
    .populate('companyId', 'name'); // Populate company name for reference

  return deals;
};

const updateVendor = async (id: string, data: Partial<TVendor>) => {
  const vendor = await Vendor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!vendor) throw new Error('Vendor not found');
  return vendor;
};

const deleteVendor = async (id: string) => {
  // Find and delete the vendor
  const vendor = await Vendor.findByIdAndDelete(id);
  if (!vendor) throw new Error('Vendor not found');

  // Delete all related deals where vendorId matches
  await Deal.deleteMany({ vendorId: id });
};

export const VendorService = {
  createVendor,
  getAllVendors,
  getVendorById,
  getDealsByVendorName,
  updateVendor,
  deleteVendor,
};
