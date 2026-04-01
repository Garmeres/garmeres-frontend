import { getBlogPostBySlug, getBlogPosts, getLocales } from "@/lib/strapi";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

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

	const formattedDate = new Date(post.publishedAt).toLocaleDateString(locale, {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	return (
		<div className="prose max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
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

			{/* Body rendering to be added */}
		</div>
	);
}
