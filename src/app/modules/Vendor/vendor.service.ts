import { Vendor } from './vendor.model';
import { TVendor } from './vendor.type';
import { Deal } from '../Deals/deals.model';
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { Buffer } from 'buffer';


const createVendor = async (data: TVendor) => {
  const vendor = await Vendor.create(data);
  return vendor;
};

const uploadVendorsFromCSV = async (buffer: Buffer) => {
  const vendors: TVendor[] = [];

  // Parse the CSV buffer
  await new Promise<void>((resolve, reject) => {
    const stream = Readable.from(buffer);
    stream
      .pipe(csvParser())
      .on('data', (row) => {
        vendors.push({
          name: row.name,
          logo: row.logo || '', // Optional field
          website: row.website || '', // Optional field
        });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  const results = {
    createdVendors: 0,
    updatedVendors: 0,
  };

  // Iterate over the parsed vendors and add/update them in the database
  for (const vendor of vendors) {
    const existingVendor = await Vendor.findOne({ name: vendor.name });

    if (existingVendor) {
      // Update the existing vendor
      existingVendor.logo = vendor.logo || existingVendor.logo;
      existingVendor.website = vendor.website || existingVendor.website;
      await existingVendor.save();
      results.updatedVendors++;
    } else {
      // Create a new vendor
      await Vendor.create(vendor);
      results.createdVendors++;
    }
  }

  return results;
};

const getAllVendors = async (query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const vendors = await Vendor.find()
    .skip(skip)
    .limit(Number(limit));

  const total = await Vendor.countDocuments();
  const totalPage = Math.ceil(total / Number(limit)); // Calculate total pages

  return {
    meta: {
      total,
      limit: Number(limit),
      page: Number(page),
      totalPage, // Include totalPage in the meta
    },
    data: vendors,
  };
};


const getVendorById = async (id: string) => {
  const vendor = await Vendor.findById(id);
  if (!vendor) throw new Error('Vendor not found');
  return vendor;
};

const getDealsByVendorName = async (vendorName: string, query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * Number(limit);

  // Find the vendor by name
  const vendor = await Vendor.findOne({ name: vendorName });
  if (!vendor) throw new Error('Vendor not found');

  const currentDate = new Date();

  // Fetch all non-expired deals related to this vendor with pagination
  const deals = await Deal.find({
    vendorId: vendor._id,
    expiryDate: { $gte: currentDate }, // Filter only active (non-expired) deals
  })
    .skip(skip)
    .limit(Number(limit))
    .populate('vendorId', 'name logo website') // Populate vendor details
    .populate('companyId', 'name'); // Populate company name for reference

  const total = await Deal.countDocuments({
    vendorId: vendor._id,
    expiryDate: { $gte: currentDate },
  });

  const totalPage = Math.ceil(total / Number(limit)); // Calculate total pages

  return {
    meta: {
      total,
      limit: Number(limit),
      page: Number(page),
      totalPage,
    },
    data: deals,
  }
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
  uploadVendorsFromCSV,
  getAllVendors,
  getVendorById,
  getDealsByVendorName,
  updateVendor,
  deleteVendor,
};
