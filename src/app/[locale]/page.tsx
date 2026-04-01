import { getHomePage } from "@/lib/strapi";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DynamicZone } from "@/components/dynamic-zone";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const { data: homePage } = await getHomePage(locale);
	return { title: homePage.name };
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const { data: homePage } = await getHomePage(locale);

	const bannerImageUrl = homePage.bannerImage?.url;
	const buttonLink = homePage.bannerButtonLink
		? `/${locale}/${homePage.bannerButtonLink.slug}`
		: null;

	return (
		<div className="flex flex-col flex-grow">
			{/* Banner section */}
			<div className="relative flex items-center justify-center min-h-screen -mt-[calc(theme(spacing.2)+70px+theme(spacing.2))] xl:-mt-[calc(theme(spacing.3)+65px+theme(spacing.3))]">
				{bannerImageUrl && (
					<Image
						src={bannerImageUrl}
						alt=""
						width={800}
						height={800}
						quality={70}
						className="absolute inset-0 w-full h-full object-cover -z-10"
						priority
					/>
				)}
				<div className="bg-slate-100/95 w-full py-16 px-4 shadow-lg text-black">
					<div className="flex flex-col items-center gap-8 xl:gap-16 w-full max-w-[1024px] mx-auto text-center">
						<h1 className="text-3xl xl:text-4xl font-light">
							{homePage.title}
						</h1>
						<p className="text-base leading-9">{homePage.subtitle}</p>
						{buttonLink && homePage.bannerButtonText && (
							<Link
								href={buttonLink}
								className="px-8 py-3 font-extralight rounded-full bg-slate-700 text-white hover:bg-slate-600 no-underline"
							>
								{homePage.bannerButtonText}
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* Body content */}
			<div className="prose max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
				<DynamicZone components={homePage.body} locale={locale} />
			</div>
		</div>
	);
}
