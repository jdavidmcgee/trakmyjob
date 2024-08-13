'use client'; // we use the client because we are using the next/navigation hook - usePathname

import Logo from '../assets/favicon-32x32.png';
import links from '@/utils/links';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { usePathname } from 'next/navigation';
import { TbSquareRoundedLetterTFilled } from 'react-icons/tb';

function Sidebar() {
	const pathname = usePathname(); // this is a hook from next/navigation that returns the current pathname - it will be used to determine if the current pathname is equal to the href of the link
	return (
		<aside className="py-4 px-8 bg-muted h-full">
			<Image src={Logo} width={40} height={40} alt="logo" />
			{/* <TbSquareRoundedLetterTFilled size={50} /> */}
			<div className="flex flex-col mt-20 gap-y-4">
				{links.map(link => {
					const { href, label, icon } = link;
					return (
						// the asChild is a helper to create a link that looks like a button - so we can render the link inside the button component
						<Button
							key={href}
							asChild
							// if the pathname is equal to the href, set the variant to default, else set it to link, variant is a prop for the button component and will set the style of the button
							variant={pathname === href ? 'default' : 'link'}>
							<Link href={href} className="flex items-center gap-x-2 ">
								{icon} <span className="capitalize">{label}</span>
							</Link>
						</Button>
					);
				})}
			</div>
		</aside>
	);
}

export default Sidebar;
