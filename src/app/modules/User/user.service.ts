import { TUser } from './user.interface'
import { User } from './user.model'
import { Company } from '../Company/company.model'
import { returnWithMeta } from '../../utils/returnWithMeta'
import { Vendor } from '../Vendor/vendor.model'

const createUserIntoDB = async (userData: Partial<TUser>): Promise<TUser> => {
  return await User.create(userData)
}

const getAllUsersFromDB = async (query: any) => {
  const { limit = 10, page = 1 } = query
  const limitNum = Number(limit)
  const pageNum = Number(page)
  const skip = (pageNum - 1) * limitNum

  const result = await User.find().limit(limitNum).skip(skip)
  const total = await User.countDocuments()

  return {
    meta: {
      total,
      limit: limitNum,
      page: pageNum,
      totalPage: Math.ceil(total / limitNum), // Include total pages
    },
    result,
  }
}

const getMe = async (email: string): Promise<TUser | null> => {
  return await User.findOne({ email })
}

const updateUserRoleIntoDB = async (
  id: string,
  data: Partial<TUser>,
): Promise<TUser | null> => {
  return await User.findByIdAndUpdate(id, data, { new: true })
}

const deleteUserIntoDB = async (id: string): Promise<TUser | null> => {
  return await User.findByIdAndDelete(id)
}

const subscribeUser = async (id: string): Promise<TUser | null> => {
  const user = await User.findById(id)
  if (!user) throw new Error('User not found')

  user.isSubscribed = true
  user.subscriptionDate = new Date()
  await user.save()

  return user
}

const addFavoriteCompany = async (userId: string, companyId: string) => {
  const company = await Company.findById(companyId)
  if (!company) throw new Error('Company not found')

  const user = await User.findById(userId).populate('favorites', 'name')
  if (!user) throw new Error('User not found')

  if (user.favorites.length >= 20) {
    throw new Error('You can only have up to 20 favorite companies.')
  }

  return await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favorites: companyId } }, // Prevent duplicates
    { new: true },
  ).populate('favorites', 'name')
}

const addFavoriteCreditCardVendor = async (
  userId: string,
  vendorId: string,
) => {
  const vendor = await Vendor.findById(vendorId)
  if (!vendor) throw new Error('Vendor not found')

  const user = await User.findById(userId).populate('favorites', 'name')
  if (!user) throw new Error('User not found')

  if (user.favorites.length >= 20) {
    throw new Error('You can only have up to 20 favorite companies.')
  }

  return await User.findByIdAndUpdate(
    userId,
    { $addToSet: { favoriteCreditCardVendors: vendorId } }, // Prevent duplicates
    { new: true },
  ).populate('favorites', 'name')
}

const removeFavoriteCompany = async (userId: string, companyId: string) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { favorites: companyId } }, // Remove the company ID
    { new: true },
  ).populate('favorites', 'name')
}

const removeFavoriteCreditCardVendor = async (
  userId: string,
  vendorId: string,
) => {
  return await User.findByIdAndUpdate(
    userId,
    { $pull: { favoriteCreditCardVendors: vendorId } }, // Remove the vendor ID
    { new: true },
  ).populate('favorites', 'name')
}

const getAllFavoriteCompanies = async (
  userId: string,
  query: any,
): Promise<any> => {
  const { limit = 10, page = 1 } = query
  const limitNum = Number(limit)
  const pageNum = Number(page)
  const skip = (pageNum - 1) * limitNum

  const user = await User.findById(userId)
    .populate({
      path: 'favorites',
      select: 'name description logo website',
      options: { skip, limit: limitNum },
    })
    .select('favorites')

  if (!user) throw new Error('User not found')

  const total = user.favorites?.length || 0
  return returnWithMeta(
    { total, limit: limitNum, page: pageNum },
    user.favorites,
  )
}

const getAllFavoriteCreditCardVendors = async (
  userId: string,
  query: any,
): Promise<any> => {
  const { limit = 10, page = 1 } = query
  const limitNum = Number(limit)
  const pageNum = Number(page)
  const skip = (pageNum - 1) * limitNum

  const user = await User.findById(userId)
    .populate({
      path: 'favoriteCreditCardVendors',
      select: 'name logo website description', // Fields to select from the vendor
      options: {
        skip,
        limit: limitNum,
      },
    })
    .select('favoriteCreditCardVendors')

  if (!user) {
    throw new Error('User not found')
  }

  const total = user.favoriteCreditCardVendors?.length || 0
  return returnWithMeta(
    { total, limit: limitNum, page: pageNum },
    user.favoriteCreditCardVendors,
  )
}

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getMe,
  updateUserRoleIntoDB,
  deleteUserIntoDB,
  subscribeUser,
  addFavoriteCompany,
  addFavoriteCreditCardVendor,
  removeFavoriteCompany,
  removeFavoriteCreditCardVendor,
  getAllFavoriteCompanies,
  getAllFavoriteCreditCardVendors,
}
