import fs from 'fs';
import csvParser from 'csv-parser';
import { Deal } from './deals.model';

const processCSV = async (filePath: string): Promise<string> => {
  const deals: any[] = [];

  // Read and parse the CSV file
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        deals.push(row);
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  // Process each deal (create or update)
  for (const deal of deals) {
    const { title, percentage, type, vendorId, companyId, expiryDate, link } = deal;

    // Check if the deal already exists
    const existingDeal = await Deal.findOne({ title, vendorId, companyId });

    if (existingDeal) {
      // Update existing deal
      existingDeal.percentage = percentage;
      existingDeal.type = type;
      existingDeal.expiryDate = new Date(expiryDate);
      existingDeal.link = link;
      existingDeal.isActive = new Date(expiryDate) > new Date();
      await existingDeal.save();
    } else {
      // Create a new deal
      await Deal.create({
        title,
        percentage,
        type,
        vendorId,
        companyId,
        expiryDate: new Date(expiryDate),
        link,
        isActive: new Date(expiryDate) > new Date(),
      });
    }
  }

  // Delete the uploaded file after processing
  fs.unlinkSync(filePath);

  return `Processed ${deals.length} deals successfully.`;
};

const getAllDeals = async (query: any): Promise<any> => {
  const { type, vendorId, companyId } = query;
  const filter: any = { isActive: true };

  if (type) filter.type = type;
  if (vendorId) filter.vendorId = vendorId;
  if (companyId) filter.companyId = companyId;

  return await Deal.find(filter).populate(['vendorId', 'companyId']);
};

const getTopDeals = async (): Promise<any> => {
  return await Deal.aggregate([
    { $match: { isActive: true } },
    { $sort: { percentage: -1 } },
    { $group: { _id: '$companyId', topDeal: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$topDeal' } },
  ]);
};

export const DealServices = {
  processCSV,
  getAllDeals,
  getTopDeals,
};
