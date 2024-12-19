import { TUser } from './user.interface';
import { User } from './user.model';
import { Company } from '../Company/company.model';
import { returnWithMeta } from '../../utils/returnWithMeta';

const createUserIntoDB = async (userData: Partial<TUser>): Promise<TUser> => {
  const user = await User.create(userData);
  return user;
};

const getAllUsersFromDB = async (query: any) => {
  const { limit = 10, page = 1 } = query;
  const limitNum = Number(limit);
  const pageNum = Number(page);
  const skip = (pageNum - 1) * limitNum;

  const result = await User.find().limit(limitNum).skip(skip);
  const total = await User.countDocuments();

  const totalPage = Math.ceil(total / limitNum);

  return {
    meta: {
      total,
      limit: limitNum,
      page: pageNum,
      totalPage, // Add totalPage here
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
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Company not found');

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: companyId } }, // Prevent duplicates
    { new: true },
  ).populate('favorites', 'name'); // Populate favorite companies

  return user;
};

const removeFavoriteCompany = async (userId: string, companyId: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorites: companyId } }, // Remove the company ID
    { new: true },
  ).populate('favorites', 'name');

  return user;
};

const getAllFavoriteCompanies = async (userId: string, query: any): Promise<any> => {
  const { limit = 10, page = 1 } = query;
  const limitNum = Number(limit);
  const pageNum = Number(page);
  const skip = (pageNum - 1) * limitNum;

  const user = await User.findById(userId)
    .populate({
      path: 'favorites',
      select: 'name description logo website',
      options: {
        skip,
        limit: limitNum,
      },
    })
    .select('favorites');

  if (!user) {
    throw new Error('User not found');
  }

  const total = user.favorites?.length || 0;
  return returnWithMeta({ total, limit: limitNum, page: pageNum }, user.favorites);
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
  getAllFavoriteCompanies,
};
