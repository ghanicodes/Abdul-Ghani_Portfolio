import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    img: {
      type: String,
      required: [true, 'Project image URL or data is required'],
    },
    desc: {
      type: String,
      required: [true, 'Project description is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    live: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: ['mern', 'shopify'],
      lowercase: true,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'draft'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Project', projectSchema);
