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

export interface ILoanFormTemplateField {
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}

export interface ILoanFormTemplate extends Document {
  name: string;
  loanType?: string;
  fields: ILoanFormTemplateField[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LoanFormTemplateSchema = new Schema<ILoanFormTemplate>({
  name: { type: String, required: true },
  loanType: { type: String },
  fields: [
    {
      label: { type: String, required: true },
      type: { type: String, required: true },
      required: { type: Boolean, default: false },
      options: { type: [String], default: undefined },
    },
  ],
  createdBy: { type: String, required: true },
}, { timestamps: true });

export const LoanFormTemplate = mongoose.models.LoanFormTemplate || mongoose.model<ILoanFormTemplate>('LoanFormTemplate', LoanFormTemplateSchema);

export interface ILoanFormSubmission extends Document {
  templateId: string;
  values: Record<string, any>;
  submittedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LoanFormSubmissionSchema = new Schema<ILoanFormSubmission>({
  templateId: { type: String, required: true },
  values: { type: Object, required: true },
  submittedBy: { type: String, required: true },
}, { timestamps: true });

export const LoanFormSubmission = mongoose.models.LoanFormSubmission || mongoose.model<ILoanFormSubmission>('LoanFormSubmission', LoanFormSubmissionSchema);

const notificationSchema = new Schema({
  userId: { type: String, required: true },
  title: {type: String, required: true},
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);


