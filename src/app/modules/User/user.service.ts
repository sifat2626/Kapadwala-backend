import { TUser } from './user.interface';
import { User } from './user.model';
import { Company } from '../Company/company.model'

const createUserIntoDB = async (userData: Partial<TUser>): Promise<TUser> => {
  const user = await User.create(userData);
  return user;
};

const getAllUsersFromDB = async (query: any): Promise<{ meta: any; result: TUser[] }> => {
  const { limit = 10, page = 1 } = query;
  const skip = (page - 1) * limit;

  const result = await User.find().limit(limit).skip(skip);
  const total = await User.countDocuments();

  return {
    meta: {
      total,
      limit,
      page,
    },
    result,
  };
};

const getMe = async (email: string): Promise<TUser | null> => {
  const user = await User.findOne({ email });
  return user;
};

const updateUserRoleIntoDB = async (id: string, data: Partial<TUser>): Promise<TUser | null> => {
  const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
  return updatedUser;
};

const deleteUserIntoDB = async (id: string): Promise<TUser | null> => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};

const subscribeUser = async (id: string): Promise<TUser | null> => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  user.isSubscribed = true;
  user.subscriptionDate = new Date();
  await user.save();

  return user;
};

const addFavoriteCompany = async (userId: string, companyId: string) => {
  // Check if the company exists
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Company not found');

  // Add the company to the user's favorites if not already added
  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: companyId } }, // Prevent duplicates
    { new: true },
  ).populate('favorites', 'name'); // Populate favorite companies

  return user;
};

const removeFavoriteCompany = async (userId: string, companyId: string) => {
  // Remove the company from the user's favorites
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorites: companyId } }, // Remove the company ID
    { new: true },
  ).populate('favorites', 'name');

  return user;
};

const getAllFavoriteCompanies = async (userId: string): Promise<TUser | null> => {
  // Fetch the user and populate their favorite companies
  const user = await User.findById(userId)
    .populate('favorites', 'name description logo website') // Populate company details
    .select('favorites'); // Return only the favorites field

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getMe,
  updateUserRoleIntoDB,
  deleteUserIntoDB,
  subscribeUser,
  addFavoriteCompany,
  removeFavoriteCompany,
  getAllFavoriteCompanies
};
