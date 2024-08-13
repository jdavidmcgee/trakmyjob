import { z } from 'zod';

export enum JobStatus {
	Applied = 'applied',
	Interview = 'interview',
	Offer = 'offer',
	Pending = 'pending',
	Declined = 'declined',
	Rejected = 'rejected',
}

export enum JobMode {
	FullTime = 'full-time',
	PartTime = 'part-time',
	Internship = 'internship',
    Contractor = 'contractor',
}

export type JobType = {
	id: string;
	clerkId: string;
	position: string;
	company: string;
	location: string;
	status: string;
	mode: string;
	createdAt: Date;
	updatedAt: Date;
};

export const createAndEditJobSchema = z.object({
	position: z.string().min(2, {
		message: 'Position must be at least 2 characters.',
	}),
	company: z.string().min(2, {
		message: 'Company must be at least 2 characters.',
	}),
	location: z.string().min(2, {
		message: 'Location must be at least 2 characters.',
	}),
	status: z.nativeEnum(JobStatus),
	mode: z.nativeEnum(JobMode),
});

export type CreateAndEditJobType = z.infer<typeof createAndEditJobSchema>;
