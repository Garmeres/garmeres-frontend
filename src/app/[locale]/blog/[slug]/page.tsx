import { getBlogPostBySlug, getBlogPosts, getLocales } from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;
	const result = await getBlogPostBySlug(slug, locale);
	if (!result) return {};
	return { title: result.data.title };
}

export async function generateStaticParams() {
	const locales = await getLocales();
	const params: { locale: string; slug: string }[] = [];
	for (const locale of locales) {
		const { data: posts } = await getBlogPosts(locale.code);
		for (const post of posts) {
			params.push({ locale: locale.code, slug: post.slug });
		}
	}
	return params;
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { locale, slug } = await params;
	const result = await getBlogPostBySlug(slug, locale);
	if (!result) notFound();
	const { data: post } = result;

	return (
		<article>
			<h1>{post.title}</h1>
		</article>
	);
}
