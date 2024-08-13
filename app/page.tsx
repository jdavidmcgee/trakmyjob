import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/logo.svg';
import Logo2 from '@/assets/favicon-32x32.png'
import LandingImg from '@/assets/undraw_adventure_re_ncqp.svg';
import { TbSquareRoundedLetterTFilled } from 'react-icons/tb';


export default function Home() {
	return (
		<main>
			<header className="max-w-6xl mx-auto px-4 sm:px-8 py-6 ">
				<Image src={Logo2} width={40} height={40} alt="trakMyJob Logo" />
				{/* <TbSquareRoundedLetterTFilled size={50} /> */}
			</header>
			<section className="max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,550px] items-center">
				<div>
					<h1 className="text-4xl md:text-6xl font-bold">
						 <span className="text-primary">trak</span>myJob App
					</h1>
					<p className="leading-loose md:text-lg max-w-md mt-4 ">
						Charting your career path has never been easier. trakmyJob is
						a handy app to keep track of all of your job applications,
						interviews, and offers.
					</p>
					{/* since the button is 'asChild' what ever we place inside of button (in this case it is a link) are children and will be rendered. */}
					<Button asChild className="mt-4">
						<Link href="/add-job">Get Started</Link>
					</Button>
				</div>
				<Image
					src={LandingImg}
					alt="trakmyJob Landing Image"
					className="hidden lg:block"
				/>
			</section>
		</main>
	);
}
