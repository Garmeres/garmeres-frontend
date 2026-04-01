import { getLocales, getBlogPosts, getPages } from "@/lib/strapi";
import Link from "next/link";

export default async function DevRoutesPage() {
	if (process.env.NODE_ENV !== "development") {
		const { notFound } = await import("next/navigation");
		notFound();
	}

	const locales = await getLocales();
	const routes: { path: string; label: string }[] = [];

	for (const locale of locales) {
		routes.push({ path: `/${locale.code}`, label: `Home (${locale.name})` });

		const { data: pages } = await getPages(locale.code);
		for (const page of pages) {
			routes.push({
				path: `/${locale.code}/${page.slug}`,
				label: `${page.name} (${locale.name})`,
			});
		}

		const { data: posts } = await getBlogPosts(locale.code);
		for (const post of posts) {
			routes.push({
				path: `/${locale.code}/blog/${post.slug}`,
				label: `Blog: ${post.title} (${locale.name})`,
			});
		}
	}

	return (
		<main className="p-8 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">All Routes (dev only)</h1>
			<ul className="space-y-1">
				{routes.map((route) => (
					<li key={route.path}>
						<Link href={route.path} className="text-blue-600 hover:underline">
							{route.path}
						</Link>
						<span className="text-gray-500 ml-2 text-sm">{route.label}</span>
					</li>
				))}
			</ul>
		</main>
	);
}
