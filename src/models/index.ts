import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	plan: mongoose.Types.ObjectId; // reference to Plan
	planName:string,
	features: string[]; // features from the plan
}

const AdminSchema = new Schema<IAdmin>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		role: { type: String, required: true },
		plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
		planName:{type:String,required:true},
		features: { type: [String], required: true },
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

const LoanFormTemplateSchema = new Schema<ILoanFormTemplate>(
	{
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
	loanType: "loan" | "gov" | "insurance";
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
			enum: ["loan", "gov", "insurance"],
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
