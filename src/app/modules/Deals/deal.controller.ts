import { RequestHandler } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { DealServices } from './deal.service'
import { User } from '../User/user.model'

// Upload and process deals from a CSV file
const uploadDealsFromCSV: RequestHandler = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new Error('No file uploaded')
  }

  // Process the uploaded file
  const result = await DealServices.processCSVData(req.file.buffer) // Assuming processCSVData accepts a Buffer

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'CSV processed successfully.',
    data: result,
  })
})

// Get all deals
const getAllDeals: RequestHandler = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const deals = await DealServices.getAllDeals({ ...req.query, page, limit })

  let filteredDeals = deals

  // Limit deals to the first two if the user is not subscribed
  if (!req.user?.isSubscribed) {
    filteredDeals = {
      ...deals,
      data: deals.data.slice(0, 2),
    }
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Deals retrieved successfully.',
    data: filteredDeals,
  })
})

const getAllActiveDeals: RequestHandler = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const activeDeals = await DealServices.getAllActiveDeals({ page, limit })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All active deals retrieved successfully.',
    data: activeDeals,
  })
})

// Get top deals
const getTopDeals: RequestHandler = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const topDeals = await DealServices.getTopDeals({ page, limit })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Top deals retrieved successfully.',
    data: topDeals,
  })
})

const getBestCashbackRateByCompany: RequestHandler = catchAsync(
  async (req, res) => {
    const { companyName } = req.params
    const page = Number(req.query.page) || 1 // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10 // Default to limit 10 if not provided
    const cashbackRates = await DealServices.getBestCashbackRateByCompany(
      companyName,
      page,
      limit,
    )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Best cashback rates for '${companyName}' retrieved successfully.`,
      data: cashbackRates,
    })
  },
)

const getBestGiftcardRateByCompany: RequestHandler = catchAsync(
  async (req, res) => {
    const { companyName } = req.params
    const page = Number(req.query.page) || 1 // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10 // Default to limit 10 if not provided
    const giftcardRates = await DealServices.getBestGiftcardRateByCompany(
      companyName,
      page,
      limit,
    )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Best gift card rates for '${companyName}' retrieved successfully.`,
      data: giftcardRates,
    })
  },
)

const getActiveCashbackDeals: RequestHandler = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1 // Default to page 1 if not provided
  const limit = Number(req.query.limit) || 10 // Default to limit 10 if not provided

  const deals = await DealServices.getActiveCashbackDeals(page, limit)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active cashback deals retrieved successfully.',
    data: deals,
  })
})

const getActiveGiftcardDeals: RequestHandler = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1 // Default to page 1 if not provided
  const limit = Number(req.query.limit) || 10 // Default to limit 10 if not provided
  const deals = await DealServices.getActiveGiftcardDeals(page, limit)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active gift card deals retrieved successfully.',
    data: deals,
  })
})

const getActiveCreditcardDeals: RequestHandler = catchAsync(
  async (req, res) => {
    const page = Number(req.query.page) || 1 // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10 // Default to limit 10 if not provided
    const deals = await DealServices.getActiveCreditcardDeals(page, limit)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Active credit card deals retrieved successfully.',
      data: deals,
    })
  },
)

const getExpiringCreditcardDealsByVendor: RequestHandler = catchAsync(
  async (req, res) => {
    const { vendorName } = req.params
    const page = Number(req.query.page) || 1 // Default to page 1 if not provided
    const limit = Number(req.query.limit) || 10 // Default to limit 10 if not provided

    const deals = await DealServices.getExpiringCreditcardDealsByVendor(
      vendorName,
      page,
      limit,
    )

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Expiring credit card deals for vendor '${vendorName}' retrieved successfully.`,
      data: deals,
    })
  },
)

// Delete old deals by exact date or days
const deleteOldDeals: RequestHandler = catchAsync(async (req, res) => {
  const { date, days } = req.query

  const result = await DealServices.deleteOldDeals(
    date as string,
    days as string,
  )

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result.deletedCount,
  })
})

const getAllCreditcardDeals: RequestHandler = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const deals = await DealServices.getAllCreditcardDeals({ page, limit })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All credit card deals retrieved successfully.',
    data: deals,
  })
})

const getTopDealsFromFavorites: RequestHandler = catchAsync(
  async (req, res) => {
    const userId = req.user?._id

    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: 'User is not authenticated.',
        data: null,
      })
    }

    // Fetch the user's favorite companies and credit card vendors
    const user = await User.findById(userId)
      .populate('favorites', '_id')
      .populate('favoriteCreditCardVendors', '_id')
    if (!user || user.favorites.length === 0) {
      return sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'No favorite companies found for the user.',
        data: [],
      })
    }

    // Get all top deals
    const allTopDeals = await DealServices.getTopDeals()

    // Extract favorite company and vendor IDs
    const favoriteCompanyIds = user.favorites.map((favorite: any) =>
      favorite._id.toString(),
    )
    const favoriteCreditCardVendorIds = user.favoriteCreditCardVendors.map(
      (vendor: any) => vendor._id.toString(),
    )

    // Filter top deals by favorite company IDs
    const filteredDeals = allTopDeals.data
      .map((deal: any) => {
        // Filter credit card deals to include only those from favorite vendors
        const filteredCreditCardDeals = deal.creditCardDeals.filter(
          (creditCardDeal: any) =>
            favoriteCreditCardVendorIds.includes(
              creditCardDeal.vendor._id.toString(),
            ),
        )

        // Return the deal with the filtered credit card deals
        return {
          ...deal,
          creditCardDeals: filteredCreditCardDeals,
        }
      })
      .filter((deal: any) => {
        // Ensure the company is in the user's favorite companies
        return (
          favoriteCompanyIds.includes(deal.company.id.toString()) ||
          deal.creditCardDeals.length > 0
        ) // Include only if there are valid credit card deals
      })

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Top deals from favorite companies retrieved successfully.',
      data: filteredDeals,
    })
  },
)

// const getTopDealsFromFavorites: RequestHandler = catchAsync(async (req, res) => {
//   const userId = req.user?._id;

//   if (!userId) {
//     return sendResponse(res, {
//       statusCode: httpStatus.UNAUTHORIZED,
//       success: false,
//       message: 'User is not authenticated.',
//       data: null,
//     });
//   }

//   const topDeals = await DealServices.getTopDealsFromFavorites(userId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Top deals from favorite companies retrieved successfully.',
//     data: topDeals,
//   });
// });


export const DealControllers = {
  uploadDealsFromCSV,
  getAllActiveDeals,
  getAllDeals,
  getTopDeals,
  getBestCashbackRateByCompany,
  getBestGiftcardRateByCompany,
  getActiveGiftcardDeals,
  getActiveCashbackDeals,
  getActiveCreditcardDeals,
  getExpiringCreditcardDealsByVendor,
  deleteOldDeals,
  getAllCreditcardDeals,
  getTopDealsFromFavorites,
}
