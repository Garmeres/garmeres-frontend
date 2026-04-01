import { getPageBySlug, getPages, getLocales } from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

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

	return (
		<main>
			<h1>{page.name}</h1>
		</main>
	);
}
