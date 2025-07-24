import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	planId: mongoose.Types.ObjectId; // reference to Plan
	planName: string,
	features: string[]; // features from the plan
	isDeleted: boolean;
	resetPasswordCode?: string;
	resetPasswordExpires?: Date;
}

const AdminSchema = new Schema<IAdmin>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, required: true },
		planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
		planName: { type: String, required: true },
		features: { type: [String], required: true },
		isDeleted: { type: Boolean, default: false },
		resetPasswordCode: { type: String },
		resetPasswordExpires: { type: Date }
	},
	{ timestamps: true }
);

export const Admin =
	mongoose.models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);

export interface IApplication extends Document {
	name: string;
	email: string;
	phone: string;
	message: string;
	status: "approved" | "rejected" | "pending";
}

const ApplicationSchema = new Schema<IApplication>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, required: true },
		message: { type: String, required: true },
		status: {
			type: String,
			enum: ["approved", "rejected", "pending"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

export const Application =
	mongoose.models.Application ||
	mongoose.model<IApplication>("Application", ApplicationSchema);

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

const PlanSchema = new Schema<IPlan>(
	{
		name: { type: String, required: true },
		features: { type: [String], required: true },
		description: { type: String },
		amount: { type: Number, required: true },
		duration: { type: Number, required: true },
		isActive: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export const Plan =
	mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);

export interface ILoanFormField {
  label: string;
  type: "text" | "number" | "select" | "date" | "checkbox" | "textarea" | "document";
  required?: boolean;
  options?: string[]; // For select fields
  fixed?: boolean; // For fields that should not be editable by the admin
  description?: string; 
  placeholder?: string; 
  defaultValue?: string;
}

export interface ILoanFormPage {
  title: string;
  fields: ILoanFormField[];
  pageNumber: number; 
  description?: string; 
  fixed?: boolean; // Indicates if the page is fixed and cannot be deleted
}

export interface ILoanFormTemplate extends Document {
  name: string; // e.g., "Car Loan"
  loanType: "private" | "government" | "insurance";
  icon: string;
  description: string;
  pages: ILoanFormPage[];
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LoanFormFieldSchema = new Schema<ILoanFormField>(
  {
    label: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["text", "number", "select", "date", "checkbox", "textarea", "document"],
    },
    required: { type: Boolean, default: false },
    options: { type: [String], default: undefined },
	fixed: { type: Boolean, default: false },
	description: { type: String }, 
	placeholder: { type: String }, 
	defaultValue: { type: String },
  },
  { _id: false }
);

const LoanFormPageSchema = new Schema<ILoanFormPage>(
  {
    title: { type: String, required: true },
    fields: { type: [LoanFormFieldSchema], required: true },
	pageNumber: { type: Number, required: true },
	description: { type: String },
	fixed: { type: Boolean, default: false },
  },
  { _id: false }
);

const LoanFormTemplateSchema = new Schema<ILoanFormTemplate>(
  {
    name: { type: String, required: true },
    loanType: {
      type: String,
      required: true,
      enum: ["private", "government", "insurance"],
    },
	icon: { type: String },
	description: { type: String },
    pages: { type: [LoanFormPageSchema], required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const LoanFormTemplate =
  mongoose.models.LoanFormTemplate ||
  mongoose.model<ILoanFormTemplate>("LoanFormTemplate", LoanFormTemplateSchema);

export interface ILoan extends Document {
	values: Record<string, any>;
	subscriber: string;
	createdAt?: Date;
	updatedAt?: Date;
	status: "pending" | "approved" | "rejected";
	loanType: "private" | "government" | "insurance";
	loanSubType: string;
	rejectionMessage?: string; // Optional field for rejection reason
}

const LoanSchema = new Schema<ILoan>(
	{
		values: { type: Object, required: true },
		subscriber: { type: String, required: true },
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
		loanType: {
			type: String,
			enum: ["private", "government", "insurance"],
			required: true,
		},
		loanSubType: { type: String, required: true },
		rejectionMessage: { type: String }, // Add to schema
	},
	{ timestamps: true }
);

export const Loan =
	mongoose.models.Loan || mongoose.model<ILoan>("Loan", LoanSchema);

export interface INotification extends Document {
	userId: Record<string, any>;
	title: string;
	message: string;
	read: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Admin",
			required: true,
		},
		title: { type: String, required: true },
		message: { type: String, required: true },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const Notification =
	mongoose.models.Notification ||
	mongoose.model<INotification>("Notification", notificationSchema);
