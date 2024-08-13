'use client';

import { Input } from './ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from './ui/button';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { JobStatus } from '@/utils/types';

function SearchForm() {
	const searchParams = useSearchParams();
  // we are grabbing the data from the URL
	const search = searchParams.get('search') || '';
	const jobStatus = searchParams.get('jobStatus') || 'all';

	const router = useRouter();
	const pathname = usePathname();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    
		const formData = new FormData(event.currentTarget);
		const search = formData.get('search') as string;
		const jobStatus = formData.get('jobStatus') as string;
    //console.log(search, jobStatus);
    // params is an instance of URLSearchParams - we can use the set method to set the search and jobStatus
		let params = new URLSearchParams();
		params.set('search', search);
		params.set('jobStatus', jobStatus);

    // this is similar to the link or redirect function to navigate to the new URL
    // if you type 'job' in the search input and select 'all' in the jobStatus dropdown, the URL will be updated to /jobs?search=job&jobStatus=all
    // if you typed hungry and 'interview' in the search input and select 'interview' in the jobStatus dropdown, the URL will be updated to /jobs?search=hungry&jobStatus=interview
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-muted mb-16 p-8 grid sm:grid-cols-2 md:grid-cols-3  gap-4 rounded-lg">
			<Input
				type="text"
				placeholder="Search Jobs"
				name="search"
				defaultValue={search}
			/>
			<Select name="jobStatus" defaultValue={jobStatus}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{['all', ...Object.values(JobStatus)].map(jobStatus => {
						return (
							<SelectItem key={jobStatus} value={jobStatus}>
								{jobStatus}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
			<Button type="submit">Search</Button>
		</form>
	);
}

export default SearchForm;
