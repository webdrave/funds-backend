import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	phone: string;
	age: number;
	dsaCode?: string;
	rmId?: mongoose.Types.ObjectId; // reference to RM Admin (for DSA users)
	planId: mongoose.Types.ObjectId; // reference to Plan
	planName: string,
	features: string[]; // features from the plan
	isDeleted: boolean;
	resetPasswordCode?: string;
	resetPasswordExpires?: Date;
	bankDetails?: mongoose.Types.ObjectId; // reference to Bank
}

const AdminSchema = new Schema<IAdmin>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, required: true },
		phone: { type: String },
		age: { type: Number },
		dsaCode: { type: String, unique: true },
		rmId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
		planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
		planName: { type: String, required: true },
		features: { type: [String], required: true },
		isDeleted: { type: Boolean, default: false },
		resetPasswordCode: { type: String },
		resetPasswordExpires: { type: Date },
		bankDetails: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" }
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
  loanType: "private" | "government" | "insurance" | "quick" | "taxation";
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
      enum: ["private", "government", "insurance", "quick", "taxation"],
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

// ------------------
// Updated Loan Schema and Interfaces
// ------------------

export interface ILoanFormFieldValue {
  label: string;
  value: any;
  isDocument: boolean;
}

export interface ILoanFormPageValue {
  pageNumber: number;
  title: string;
  fields: ILoanFormFieldValue[];
}

export interface ILoan extends Document {
  values: ILoanFormPageValue[];
  subscriber: string;
  createdAt?: Date;
  updatedAt?: Date;
  status: "pending" | "approved" | "rejected";
  loanType: "private" | "government" | "insurance" | "quick" | "taxation";
  dsaId?: mongoose.Types.ObjectId;
  rmId?: mongoose.Types.ObjectId;
  loanSubType: string;
  rejectionMessage?: string;
}

const LoanFieldValueSchema = new Schema<ILoanFormFieldValue>(
  {
    label: { type: String, required: true },
    value: { type: Schema.Types.Mixed },
    isDocument: { type: Boolean, default: false },
  },
  { _id: false }
);

const LoanPageValueSchema = new Schema<ILoanFormPageValue>(
  {
    pageNumber: { type: Number, required: true },
    title: { type: String, required: true },
    fields: { type: [LoanFieldValueSchema], required: true },
  },
  { _id: false }
);

const LoanSchema = new Schema<ILoan>(
  {
    values: { type: [LoanPageValueSchema], required: true },
    subscriber: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    loanType: {
      type: String,
      enum: ["private", "government", "insurance", "quick", "taxation"],
      required: true,
    },
	dsaId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    rmId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    loanSubType: { type: String, required: true },
    rejectionMessage: { type: String },
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
	isDeleted?: boolean;
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
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const Notification =
	mongoose.models.Notification ||
	mongoose.model<INotification>("Notification", notificationSchema);


export interface IBank extends Document {
	accountNumber: string;
	ifsc: string;
	bankName: string;
	accountHolderName: string;
	branchName?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

const BankSchema = new Schema<IBank>(
	{
		accountNumber: { type: String },
		ifsc: { type: String },
		bankName: { type: String },
		accountHolderName: { type: String },
		branchName: { type: String },
	},
	{ timestamps: true }
);

export const Bank =
	mongoose.models.Bank || mongoose.model<IBank>("Bank", BankSchema);

export interface IIssue extends Document {
	userId: mongoose.Types.ObjectId;
	title: string;
	description: string;
	priority?: "low" | "medium" | "high" | "critical";
	category?: "bug" | "feature" | "support" | "other";
	screenshots?: string[];
	createdAt?: Date;
	updatedAt?: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
	priority: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
	category: { type: String, enum: ["bug", "feature", "support", "other"], default: "other" },
	screenshots: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Issue =
  mongoose.models.Issue || mongoose.model<IIssue>("Issue", IssueSchema);


export interface ICommission extends Document {
  loanId: mongoose.Types.ObjectId;
  dsaId?: mongoose.Types.ObjectId;
  rmId?: mongoose.Types.ObjectId;
  amount: number;          // absolute commission amount in currency
  percentage?: number;     // percentage used to compute commission (optional)
  status: "pending" | "approved" | "credited" | "rejected";
  remarks?: string;
  createdBy?: mongoose.Types.ObjectId; // who created or adjusted it
  createdAt?: Date;
  updatedAt?: Date;
}

const CommissionSchema = new Schema<ICommission>({
  loanId: { type: Schema.Types.ObjectId, ref: "Loan", required: true },
  dsaId: { type: Schema.Types.ObjectId, ref: "Admin" },
  rmId: { type: Schema.Types.ObjectId, ref: "Admin" },
  amount: { type: Number, required: true },
  percentage: { type: Number },
  status: { type: String, enum: ["pending","approved","credited","rejected"], default: "pending" },
  remarks: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

export const Commission = mongoose.models.Commission || mongoose.model<ICommission>("Commission", CommissionSchema);

/****************
 * Withdraw Request Model
 ****************/
export interface IWithdrawRequest extends Document {
  userId: mongoose.Types.ObjectId; // admin (DSA/RM/CRM)
  amount: number;
  status: "pending" | "approved" | "rejected" | "processed";
  requestedAt?: Date;
  processedAt?: Date;
  processedBy?: mongoose.Types.ObjectId; // admin who processed it
  remarks?: string;
}

const WithdrawRequestSchema = new Schema<IWithdrawRequest>({
  userId: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending","approved","rejected","processed"], default: "pending" },
  processedAt: { type: Date },
  processedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  remarks: { type: String },
}, { timestamps: true });

export const WithdrawRequest = mongoose.models.WithdrawRequest || mongoose.model<IWithdrawRequest>("WithdrawRequest", WithdrawRequestSchema);
