import { getBlogPosts } from "@/lib/strapi";
import type { BlogPostsComponent } from "@/lib/strapi/types";
import { BlogPostsList } from "./blog-posts-list";

export async function BlogPosts({
	component,
	locale,
}: {
	component: BlogPostsComponent;
	locale: string;
}) {
	const result = await getBlogPosts(locale, 1, 6);
	return (
		<div className="not-prose w-full">
			<BlogPostsList
				initialPosts={result.data}
				locale={locale}
				totalPages={result.meta.pagination.pageCount}
				loadMoreText={component.loadMoreButtonText}
				loadingMessage={component.loadingMessage}
			/>
		</div>
	);
}
