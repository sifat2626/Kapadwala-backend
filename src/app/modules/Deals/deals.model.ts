import { Schema, model } from 'mongoose';
import { TDeal, DealModel } from './deals.type';

const dealSchema = new Schema<TDeal, DealModel>(
  {
    percentage: {
      type: Number,
      min: [0, 'Percentage cannot be less than 0'],
      default: 0,
      // eslint-disable-next-line no-unused-vars
      required: function (this: any) {
        return this.type !== 'creditcard';
      },
    },
    type: {
      type: String,
      enum: ['cashback', 'giftcard', 'creditcard'],
      required: [true, 'Deal type is required'],
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor reference is required'],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    link: {
      type: String,
      required: [true, 'Link to the deal is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  },
);

// Middleware to mark expired deals as inactive
dealSchema.pre('save', function (next) {
  if (this.expiryDate < new Date()) {
    this.isActive = false;
  }
  next();
});

export const Deal = model<TDeal, DealModel>('Deal', dealSchema);
