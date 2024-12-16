import { TUser } from './user.interface';
import { User } from './user.model';

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

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getMe,
  updateUserRoleIntoDB,
  deleteUserIntoDB,
  subscribeUser,
};
