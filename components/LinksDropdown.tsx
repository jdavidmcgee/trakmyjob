import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlignLeft } from 'lucide-react';
import { Button } from './ui/button';
import links from '@/utils/links';
import Link from 'next/link';

function LinksDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild className="lg:hidden">
				<Button variant="outline" size="icon">
					<AlignLeft size={20} />
					<span className="sr-only">Toggle links</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-52 lg:hidden"
				align="start"
				sideOffset={25}>
				{links.map(link => {
					const { href, label, icon } = link;
					return (
						<DropdownMenuItem key={href}>
							<Link href={href} className="flex items-center gap-x-2 ">
								{icon} <span className="capitalize">{label}</span>
							</Link>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default LinksDropdown;
