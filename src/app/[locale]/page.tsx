import {
	getHomePage,
	getLocales,
	extractDescriptionFromBody,
} from "@/lib/strapi";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DynamicZone } from "@/components/dynamic-zone";

const SITE_URL = process.env.SITE_URL || "https://garmeres.com";

export async function generateStaticParams() {
	const locales = await getLocales();
	return locales.map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const { data: homePage } = await getHomePage(locale);
	const locales = await getLocales();
	const languages: Record<string, string> = {};
	for (const l of locales) {
		languages[l.code] = `${SITE_URL}/${l.code}`;
	}
	languages["x-default"] = `${SITE_URL}/en`;
	const description =
		homePage.subtitle || extractDescriptionFromBody(homePage.body);
	const url = `${SITE_URL}/${locale}`;
	return {
		title: homePage.name,
		description,
		alternates: {
			canonical: url,
			languages,
		},
		openGraph: {
			title: homePage.name,
			description: description || undefined,
			url,
			siteName: "Garmeres",
			locale,
			type: "website",
			images: [
				{
					url:
						homePage.bannerImage?.url || `${SITE_URL}/garmeres-logo-small.png`,
				},
			],
		},
	};
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
			<div className="relative flex items-end h-[60vh] min-h-[400px] -mt-[calc(theme(spacing.2)+70px+theme(spacing.2))] xl:-mt-[calc(theme(spacing.3)+65px+theme(spacing.3))]">
				{bannerImageUrl && (
					<Image
						src={bannerImageUrl}
						alt=""
						width={800}
						height={800}
						quality={70}
						className="absolute inset-0 w-full h-full object-cover"
						priority
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
				<div className="relative w-full px-6 pb-10">
					<div className="flex flex-col items-center gap-4 w-full max-w-[1024px] mx-auto text-center text-white">
						<h1 className="text-3xl xl:text-4xl font-light">
							{homePage.title}
						</h1>
						<p className="text-base leading-7 text-zinc-200">
							{homePage.subtitle}
						</p>
						{buttonLink && homePage.bannerButtonText && (
							<Link
								href={buttonLink}
								className="mt-2 px-6 py-2.5 text-sm rounded-full border border-white text-white hover:bg-white/15 no-underline transition-colors"
							>
								{homePage.bannerButtonText}
							</Link>
						)}
					</div>
				</div>
			</div>

			{/* Body content */}
			<div className="prose prose-sm max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
				<DynamicZone components={homePage.body} locale={locale} />
			</div>
		</div>
	);
}
