"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/strapi/types";

const FALLBACK_IMAGE = "/garmeres-logo-small.png";

function formatDate(iso: string) {
	const d = new Date(iso);
	const dd = String(d.getDate()).padStart(2, "0");
	const mm = String(d.getMonth() + 1).padStart(2, "0");
	const yyyy = d.getFullYear();
	return `${dd}.${mm}.${yyyy}`;
}

function BlogPostCard({ post, locale }: { post: BlogPost; locale: string }) {
	const imageUrl = post.thumbnail?.url ?? FALLBACK_IMAGE;
	const alt = post.thumbnail?.alternativeText ?? "";

	return (
		<Link
			href={`/${locale}/blog/${post.slug}`}
			className="flex flex-col gap-2 no-underline text-inherit hover:opacity-80 transition-opacity"
		>
			<div className="relative aspect-square w-full overflow-hidden rounded">
				<Image
					src={imageUrl}
					alt={alt}
					fill
					className="object-cover"
					sizes="(max-width: 640px) 50vw, 33vw"
				/>
			</div>
			<h3 className="text-sm font-medium line-clamp-2">{post.title}</h3>
			<span className="text-xs text-zinc-500">
				{formatDate(post.publishedAt)}
			</span>
		</Link>
	);
}

export function BlogPostsList({
	initialPosts,
	locale,
	totalPages,
	loadMoreText,
	loadingMessage,
}: {
	initialPosts: BlogPost[];
	locale: string;
	totalPages: number;
	loadMoreText: string;
	loadingMessage: string;
}) {
	const [posts, setPosts] = useState(initialPosts);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const hasMore = page < totalPages;

	async function loadMore() {
		const nextPage = page + 1;
		setLoading(true);
		try {
			const res = await fetch(
				`/api/blog-posts?locale=${encodeURIComponent(locale)}&page=${nextPage}`,
			);
			const data = await res.json();
			setPosts((prev) => [...prev, ...data.data]);
			setPage(nextPage);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col items-center gap-8 w-full">
			<div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
				{posts.map((post) => (
					<BlogPostCard key={post.documentId} post={post} locale={locale} />
				))}
			</div>
			{hasMore && (
				<button
					type="button"
					onClick={loadMore}
					disabled={loading}
					className="px-6 py-2 border rounded hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
				>
					{loading ? loadingMessage : loadMoreText}
				</button>
			)}
		</div>
	);
}
