'use server';

import prisma from './db';
import { auth } from '@clerk/nextjs';
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs'; // date formatting

// we need to set up a type-guard for checking if the user is authenticated
function authenticateAndRedirect(): string {
	const { userId } = auth();
	//console.log(`🙏 ~ file: actions.ts:13 ~ authenticateAndRedirect ~ userId:`, userId)
	if (!userId) {
		redirect('/');
	}
	return userId;
}

// where will we invoke this function?
// it will be invoked in the CreateJobForm component
// when the user submits the form - onSubmit, inside of React Query's mutation function this is where we will call this function
// the same value we are expecting from the form, we will pass it to this function
export async function createJobAction(
	values: CreateAndEditJobType
): Promise<JobType | null> {
	// await new Promise((resolve) => setTimeout(resolve, 3000));
	const userId = authenticateAndRedirect();
	// since this is async, we will use try/catch block
	try {
		// let's validate the form values - we will use the zod schema
		// here we'll call the parse method on the schema and if it passes, we'll create the job, otherwise we'll return null
		// this is a good practice to validate the form values before creating the job
		createAndEditJobSchema.parse(values);
		const job: JobType = await prisma.job.create({
			data: {
				...values,
				clerkId: userId,
			},
		});
		return job;
	} catch (error) {
		console.log(error);
		return null;
	}
}

// get all jobs action

type GetAllJobsActionTypes = {
	search?: string;
	jobStatus?: string;
	page?: number;
	limit?: number;
};

export async function getAllJobsAction({
	search,
	jobStatus,
	page = 1,
	limit = 10,
}: GetAllJobsActionTypes): Promise<{
	jobs: JobType[];
	count: number;
	page: number;
	totalPages: number;
}> {
	const userId = authenticateAndRedirect();

	try {
		let whereClause: Prisma.JobWhereInput = {
			clerkId: userId,
		};
		if (search) {
			whereClause = {
				...whereClause,
				OR: [
					{
						position: {
							contains: search,
						},
					},
					{
						company: {
							contains: search,
						},
					},
				],
			};
		}

		if (jobStatus && jobStatus !== 'all') {
			whereClause = {
				...whereClause,
				status: jobStatus,
			};
		}

		const jobs: JobType[] = await prisma.job.findMany({
			where: whereClause,
			orderBy: { createdAt: 'desc' },
		});

		return { jobs, count: 0, page: 1, totalPages: 0 };
	} catch (error) {
		console.log(error);
		return { jobs: [], count: 0, page: 1, totalPages: 0 };
	}
}

// delete job action

export async function deleteJobAction(id: string): Promise<JobType | null> {
	const userId = authenticateAndRedirect();

	try {
        // we need the job id matches the user id
		const job: JobType = await prisma.job.delete({
			where: {
				id,
				clerkId: userId,
			},
		});
		return job;
	} catch (error) {
		return null;
	}
}

// get a single job action

export async function getSingleJobAction(id: string): Promise<JobType | null> {
	let job: JobType | null = null;
	const userId = authenticateAndRedirect();

	try {
		job = await prisma.job.findUnique({
			where: {
				id,
				clerkId: userId,
			},
		});
	} catch (error) {
		job = null;
	}
	if (!job) {
		redirect('/jobs');
	}
	return job;
}

// update job action

export async function updateJobAction(
	id: string,
	values: CreateAndEditJobType
): Promise<JobType | null> {
	const userId = authenticateAndRedirect();

	try {
		const job: JobType = await prisma.job.update({
			where: {
				id,
				clerkId: userId,
			},
			data: {
				...values,
			},
		});
		return job;
	} catch (error) {
		return null;
	}
}

// get stats action
// Applied = 'applied',
// 	Interview = 'interview',
// 	Offer = 'offer',
// 	Pending = 'pending',
// 	Declined = 'declined',
// 	Rejected = 'rejected',

export async function getStatsAction(): Promise<{
	applied: number;
	interview: number;
	offer: number;
	pending: number;
	declined: number;
	rejected: number;
}> {
	const userId = authenticateAndRedirect();
	// just to show Skeleton
	// await new Promise((resolve) => setTimeout(resolve, 5000));
	try {
		const stats = await prisma.job.groupBy({
			by: ['status'],
			_count: {
				status: true,
			},
			where: {
				clerkId: userId, // replace userId with the actual clerkId
			},
		});
		console.log(stats);
		// [
		// 	{ _count: { status: 26 }, status: 'pending' },
		// 	{ _count: { status: 16 }, status: 'declined' },
		// 	{ _count: { status: 19 }, status: 'rejected' },
		// 	{ _count: { status: 13 }, status: 'offer' },
		// 	{ _count: { status: 9 }, status: 'applied' },
		// 	{ _count: { status: 17 }, status: 'interview' },
		// ];
		const statsObject = stats.reduce((accumulator, itemOrAcc) => {
			accumulator[itemOrAcc.status] = itemOrAcc._count.status;
			return accumulator;
		}, {} as Record<string, number>);
		console.log(statsObject);
		// 		{
		//   pending: 26,
		//   declined: 16,
		//   rejected: 19,
		//   offer: 13,
		//   applied: 9,
		//   interview: 17
		// }

		const defaultStats = {
			applied: 0,
			interview: 0,
			offer: 0,
			pending: 0,
			declined: 0,
			rejected: 0,
			...statsObject,
		};
		return defaultStats;
	} catch (error) {
		redirect('/jobs');
	}
}