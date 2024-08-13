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

		const skip = (page - 1) * limit;

		const jobs: JobType[] = await prisma.job.findMany({
			where: whereClause,
			skip,
			take: limit,
			orderBy: { createdAt: 'desc' },
		});

		// how many jobs are there that match the where clause
		const count: number = await prisma.job.count({
			where: whereClause,
		});
		// how many pages are there based on the count and the limit (10)
		const totalPages = Math.ceil(count / limit);

		return { jobs, count, page, totalPages };
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
		
		const statsObject = stats.reduce((accumulator, itemOrCurr) => {
			accumulator[itemOrCurr.status] = itemOrCurr._count.status;
			return accumulator;
		}, {} as Record<string, number>);
		

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

// get charts data action
// the library we are using is expecting that the data will be in the format of an array of objects with date and count properties

export async function getChartsDataAction(): Promise<
	Array<{ date: string; count: number }>
> {
	const userId = authenticateAndRedirect();
	// we are only looking for the jobs in the last 6 months
	// prisma does not provide specific methods to work with dates, so we will use dayjs library
	const sixMonthsAgo = dayjs().subtract(6, 'month').toDate();
	try {
		const jobs = await prisma.job.findMany({
			where: {
				clerkId: userId,
				createdAt: {
					gte: sixMonthsAgo,
				},
			},
			orderBy: {
				createdAt: 'asc',
			},
		});
		

		let applicationsPerMonth = jobs.reduce((acc, job) => {
			const date = dayjs(job.createdAt).format('MMM YY');

			const existingEntry = acc.find(entry => entry.date === date);

			if (existingEntry) {
				existingEntry.count += 1;
			} else {
				acc.push({ date, count: 1 });
			}

			return acc;
		}, [] as Array<{ date: string; count: number }>);

		return applicationsPerMonth;
	} catch (error) {
		redirect('/jobs');
	}
}