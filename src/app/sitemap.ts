import type { MetadataRoute } from "next";
import { getLocales, getPages, getBlogPosts } from "@/lib/strapi";

const SITE_URL = process.env.SITE_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const locales = await getLocales();
	const localeCodes = locales.map((l) => l.code);

	const entries: MetadataRoute.Sitemap = [];

	// Home pages
	const homeAlternates: Record<string, string> = {};
	for (const code of localeCodes) {
		homeAlternates[code] = `${SITE_URL}/${code}`;
	}
	for (const code of localeCodes) {
		entries.push({
			url: `${SITE_URL}/${code}`,
			changeFrequency: "weekly",
			priority: 1,
			alternates: { languages: homeAlternates },
		});
	}

	// Pages per locale
	const allPages = await Promise.all(
		localeCodes.map(async (code) => {
			const { data } = await getPages(code);
			return { code, pages: data };
		}),
	);

	// Group pages by documentId to build alternates
	const pagesByDoc = new Map<
		string,
		{ code: string; slug: string; updatedAt: string }[]
	>();
	for (const { code, pages } of allPages) {
		for (const page of pages) {
			const group = pagesByDoc.get(page.documentId) ?? [];
			group.push({ code, slug: page.slug, updatedAt: page.updatedAt });
			pagesByDoc.set(page.documentId, group);
		}
	}

	for (const variants of pagesByDoc.values()) {
		const alternates: Record<string, string> = {};
		for (const v of variants) {
			alternates[v.code] = `${SITE_URL}/${v.code}/${v.slug}`;
		}
		for (const v of variants) {
			entries.push({
				url: `${SITE_URL}/${v.code}/${v.slug}`,
				lastModified: v.updatedAt,
				changeFrequency: "monthly",
				priority: 0.8,
				alternates: { languages: alternates },
			});
		}
	}

	// Blog posts per locale
	const allBlogPosts = await Promise.all(
		localeCodes.map(async (code) => {
			const { data } = await getBlogPosts(code, 1, 100);
			return { code, posts: data };
		}),
	);

	const postsByDoc = new Map<
		string,
		{ code: string; slug: string; updatedAt: string }[]
	>();
	for (const { code, posts } of allBlogPosts) {
		for (const post of posts) {
			const group = postsByDoc.get(post.documentId) ?? [];
			group.push({ code, slug: post.slug, updatedAt: post.updatedAt });
			postsByDoc.set(post.documentId, group);
		}
	}

	for (const variants of postsByDoc.values()) {
		const alternates: Record<string, string> = {};
		for (const v of variants) {
			alternates[v.code] = `${SITE_URL}/${v.code}/blog/${v.slug}`;
		}
		for (const v of variants) {
			entries.push({
				url: `${SITE_URL}/${v.code}/blog/${v.slug}`,
				lastModified: v.updatedAt,
				changeFrequency: "monthly",
				priority: 0.6,
				alternates: { languages: alternates },
			});
		}
	}

	return entries;
}
