import mongoose from 'mongoose';

const taxInquirySchema = new mongoose.Schema({
  // Income Details
  annualIncome: {
    type: Number,
    required: true,
  },
  monthsWorked: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  has106: {
    type: Boolean,
    default: false,
  },
  hasMultipleEmployers: {
    type: Boolean,
    default: false,
  },
  pensionContributions: {
    type: Number,
    default: 0,
  },

  // Personal Status
  maritalStatus: {
    type: String,
    required: true,
    enum: ['single', 'married', 'divorced', 'widowed'],
  },
  childrenUnder18: {
    type: Number,
    default: 0,
    min: 0,
  },
  childrenUnder5: {
    type: Number,
    default: 0,
    min: 0,
  },
  singleParent: {
    type: Boolean,
    default: false,
  },
  newImmigrant: {
    type: Boolean,
    default: false,
  },
  immigrationYear: {
    type: Number,
    min: 1948,
    max: new Date().getFullYear(),
  },
  academicDegree: {
    type: Boolean,
    default: false,
  },
  degreeType: {
    type: String,
    enum: ['', 'first', 'second', 'third'],
  },
  completionYear: {
    type: Number,
    min: 1948,
    max: new Date().getFullYear(),
  },

  // Deductions & Credits
  liveInPriorityArea: {
    type: Boolean,
    default: false,
  },
  priorityAreaName: {
    type: String,
  },
  hasMedicalCondition: {
    type: Boolean,
    default: false,
  },
  hasDisabledFamilyMember: {
    type: Boolean,
    default: false,
  },
  paidChildcare: {
    type: Boolean,
    default: false,
  },
  childcareAmount: {
    type: Number,
    default: 0,
  },
  paidParentCare: {
    type: Boolean,
    default: false,
  },
  parentCareAmount: {
    type: Number,
    default: 0,
  },
  donationsAmount: {
    type: Number,
    default: 0,
  },

  // Contact Info
  contactName: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },

  // Status and Timestamps
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending',
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt timestamp before saving
taxInquirySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const TaxInquiry = mongoose.models.TaxInquiry || mongoose.model('TaxInquiry', taxInquirySchema);
