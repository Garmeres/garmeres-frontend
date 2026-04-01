import { getPageBySlug, getPages, getLocales } from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;
	const result = await getPageBySlug(slug, locale);
	if (!result) return {};
	return { title: result.data.name };
}

export async function generateStaticParams() {
	const locales = await getLocales();
	const params: { locale: string; slug: string }[] = [];
	for (const locale of locales) {
		const { data: pages } = await getPages(locale.code);
		for (const page of pages) {
			params.push({ locale: locale.code, slug: page.slug });
		}
	}
	return params;
}

export default async function DynamicPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { locale, slug } = await params;
	const result = await getPageBySlug(slug, locale);
	if (!result) notFound();
	const { data: page } = result;

	const backgroundImageUrl = page.backgroundImage?.url;

	return (
		<div className="flex flex-col h-full flex-grow">
			{backgroundImageUrl && (
				<Image
					src={backgroundImageUrl}
					alt=""
					width={800}
					height={800}
					quality={70}
					className="absolute top-0 left-0 right-0 w-screen h-screen min-h-screen max-h-screen object-cover -z-10"
				/>
			)}
			<div className="prose max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
				<h1>{page.name}</h1>
				{/* Body rendering to be added */}
			</div>
		</div>
	);
}
