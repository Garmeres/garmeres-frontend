import Link from "next/link";

export default function NotFound() {
	return (
		<div className="prose prose-sm max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
			<h1>Page not found</h1>
			<p>It might have been moved, or the URL could be wrong.</p>
			<p>Choose a language:</p>
			<ul>
				<li>
					<Link href="/se">Davvisámegiella</Link>
				</li>
				<li>
					<Link href="/en">English</Link>
				</li>
				<li>
					<Link href="/no">Norsk</Link>
				</li>
			</ul>
		</div>
	);
}
