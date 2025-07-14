import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);

export interface IApplication extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'approved' | 'rejected' | 'pending';
}

const ApplicationSchema = new Schema<IApplication>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
}, { timestamps: true });

export const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export interface IPlan extends Document {
  name: string;
  description?: string;
  amount: number;
  features: string[];
  duration: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const PlanSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  features: { type: [String], required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  duration: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Plan = mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);
