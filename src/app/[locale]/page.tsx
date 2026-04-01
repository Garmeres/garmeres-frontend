import { getHomePage } from "@/lib/strapi";
import type { Metadata } from "next";

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

	return (
		<main>
			<h1>{homePage.title}</h1>
			<p>{homePage.subtitle}</p>
		</main>
	);
}
