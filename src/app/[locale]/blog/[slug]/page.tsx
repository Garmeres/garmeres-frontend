import {
	getBlogPostBySlug,
	getBlogPosts,
	getLocales,
	getBlogPostSlugsForAllLocales,
	extractDescriptionFromBlocks,
} from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { RichText } from "@/components/dynamic-zone/rich-text";

const SITE_URL = process.env.SITE_URL || "https://garmeres.com";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
	const { locale, slug } = await params;
	const result = await getBlogPostBySlug(slug, locale);
	if (!result) return {};
	const slugMap = await getBlogPostSlugsForAllLocales(slug, locale);
	const languages: Record<string, string> = {};
	for (const [loc, locSlug] of Object.entries(slugMap)) {
		languages[loc] = `${SITE_URL}/${loc}/blog/${locSlug}`;
	}
	if (slugMap.en) {
		languages["x-default"] = `${SITE_URL}/en/blog/${slugMap.en}`;
	}
	const description = extractDescriptionFromBlocks(result.data.body);
	const url = `${SITE_URL}/${locale}/blog/${slug}`;
	return {
		title: result.data.title,
		description,
		alternates: {
			canonical: url,
			languages,
		},
		openGraph: {
			title: result.data.title,
			description: description || undefined,
			url,
			siteName: "Garmeres",
			locale,
			type: "article",
			publishedTime: result.data.publishedAt,
			images: [
				{
					url:
						result.data.thumbnail?.url || `${SITE_URL}/garmeres-logo-small.png`,
				},
			],
		},
		twitter: {
			card: result.data.thumbnail ? "summary_large_image" : "summary",
		},
	};
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

	const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		datePublished: post.publishedAt,
		dateModified: post.updatedAt,
		url: `${SITE_URL}/${locale}/blog/${slug}`,
		inLanguage: locale,
		author: { "@type": "Organization", name: "Garmeres" },
		publisher: { "@type": "Organization", name: "Garmeres" },
		...(post.thumbnail?.url && { image: post.thumbnail.url }),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<div className="prose prose-sm max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
				{/* Thumbnail */}
				{post.thumbnail && (
					<div className="not-prose items-center flex flex-col mx-auto gap-4 mb-16">
						<Image
							src={post.thumbnail.url}
							alt={post.thumbnail.alternativeText ?? ""}
							width={720}
							height={512}
							quality={70}
							className="max-h-[420px] object-contain"
						/>
						{post.thumbnail.caption && (
							<span className="items-center text-center">
								{post.thumbnail.caption}
							</span>
						)}
					</div>
				)}

				{/* Title and date */}
				<div>
					<h1>{post.title}</h1>
					<p className="text-base text-gray-500">- {formattedDate}</p>
				</div>

				{/* Body */}
				<RichText blocks={post.body} />
			</div>
		</>
	);
}
