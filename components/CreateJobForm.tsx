'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form'; // returns the instance of the form
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	JobStatus,
	JobType,
	JobMode,
	createAndEditJobSchema,
	CreateAndEditJobType,
} from '@/utils/types';
import { CustomFormField, CustomFormSelect } from './FormComponents';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJobAction } from '@/utils/actions';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

function CreateJobForm() {
	const form = useForm<CreateAndEditJobType>({
		resolver: zodResolver(createAndEditJobSchema),
		defaultValues: {
			position: '',
			company: '',
			location: '',
			status: JobStatus.Applied,
			mode: JobMode.FullTime,
		},
	});

	const queryClient = useQueryClient();
	const { toast } = useToast();
	const router = useRouter();
	const { mutate, isPending } = useMutation({
		mutationFn: (values: CreateAndEditJobType) => createJobAction(values),
		onSuccess: data => {
			if (!data) {
				toast({
					description: 'there was an error',
				});
				return;
			}
			toast({ description: 'job created' });
            // if we don't invalidate the queries, the new job won't show up in the list, because the old data is still cached
			queryClient.invalidateQueries({ queryKey: ['jobs'] });
			queryClient.invalidateQueries({ queryKey: ['stats'] });
			queryClient.invalidateQueries({ queryKey: ['charts'] });

			router.push('/jobs'); // redirect to the jobs page
			// form.reset(); // the form has the reset option, but it doesn't seem to reset the select forms
		},
	});

	function onSubmit(values: CreateAndEditJobType) {
		mutate(values);
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="bg-muted p-8 rounded">
				<h2 className="capitalize font-semibold text-3xl mb-6">add job</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
					<CustomFormField control={form.control} name="position" />
					<CustomFormField control={form.control} name="company" />
					<CustomFormField control={form.control} name="location" />
					<CustomFormSelect
						control={form.control}
						name="status"
						items={Object.values(JobStatus)}
						labelText="job status"
					/>
					<CustomFormSelect
						control={form.control}
						name="mode"
						items={Object.values(JobMode)}
						labelText="job mode"
					/>
					<Button
						type="submit"
						className="self-end capitalize"
						disabled={isPending}>
						{isPending ? 'loading...' : 'create job'}
					</Button>
				</div>
			</form>
		</Form>
	);
}
export default CreateJobForm;
