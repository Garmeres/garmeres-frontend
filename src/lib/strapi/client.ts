import type {
	BlogPost,
	Contact,
	HomePage,
	Locale,
	Page,
	SocialMedia,
	StrapiCollectionResponse,
	StrapiSingleResponse,
} from "./types";

const STRAPI_URL = process.env.STRAPI_URL!;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN!;

async function fetchStrapi<T>(
	path: string,
	params?: Record<string, string>,
): Promise<T> {
	const url = new URL(`/api${path}`, STRAPI_URL);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			url.searchParams.set(key, value);
		}
	}

	const res = await fetch(url.toString(), {
		headers: {
			Authorization: `Bearer ${STRAPI_API_TOKEN}`,
		},
	});

	if (!res.ok) {
		throw new Error(
			`Strapi API error: ${res.status} ${res.statusText} for ${path}`,
		);
	}

	return res.json();
}

// --- Locales ---

export async function getLocales(): Promise<Locale[]> {
	return fetchStrapi<Locale[]>("/i18n/locales");
}

// --- Single types ---

export async function getHomePage(
	locale: string,
): Promise<StrapiSingleResponse<HomePage>> {
	return fetchStrapi<StrapiSingleResponse<HomePage>>("/home-page", {
		locale,
		populate: "*",
	});
}

export async function getHomePages(): Promise<
	StrapiSingleResponse<HomePage[]>
> {
	return fetchStrapi<StrapiSingleResponse<HomePage[]>>("/home-page", {
		locale: "all",
		populate: "*",
	});
}

export async function getContact(): Promise<StrapiSingleResponse<Contact>> {
	return fetchStrapi<StrapiSingleResponse<Contact>>("/contact");
}

// --- Collection types ---

export async function getPages(
	locale: string,
): Promise<StrapiCollectionResponse<Page>> {
	return fetchStrapi<StrapiCollectionResponse<Page>>("/pages", {
		locale,
		populate: "*",
		sort: "menuIndex:asc",
	});
}

export async function getPageBySlug(
	slug: string,
	locale: string,
): Promise<StrapiSingleResponse<Page> | null> {
	const res = await fetchStrapi<StrapiCollectionResponse<Page>>("/pages", {
		locale,
		"filters[slug][$eq]": slug,
		populate: "*",
	});
	if (res.data.length === 0) return null;
	return { data: res.data[0], meta: res.meta };
}

export async function getMenuPages(
	locale: string,
): Promise<StrapiCollectionResponse<Page>> {
	return fetchStrapi<StrapiCollectionResponse<Page>>("/pages", {
		locale,
		"filters[showInMenu][$eq]": "true",
		sort: "menuIndex:asc",
		"fields[0]": "name",
		"fields[1]": "slug",
		"fields[2]": "menuIndex",
	});
}

export async function getBlogPosts(
	locale: string,
	page = 1,
	pageSize = 10,
): Promise<StrapiCollectionResponse<BlogPost>> {
	return fetchStrapi<StrapiCollectionResponse<BlogPost>>("/blog-posts", {
		locale,
		populate: "*",
		sort: "createdAt:desc",
		"pagination[page]": String(page),
		"pagination[pageSize]": String(pageSize),
	});
}

export async function getBlogPostBySlug(
	slug: string,
	locale: string,
): Promise<StrapiSingleResponse<BlogPost> | null> {
	const res = await fetchStrapi<StrapiCollectionResponse<BlogPost>>(
		"/blog-posts",
		{
			locale,
			"filters[slug][$eq]": slug,
			populate: "*",
		},
	);
	if (res.data.length === 0) return null;
	return { data: res.data[0], meta: res.meta };
}

export async function getSocialMediaLinks(): Promise<
	StrapiCollectionResponse<SocialMedia>
> {
	return fetchStrapi<StrapiCollectionResponse<SocialMedia>>("/social-medias", {
		populate: "*",
		sort: "index:asc",
	});
}

// --- Locale path map ---

export async function getLocalePathMap(): Promise<
	Record<string, Record<string, string>>
> {
	const locales = await getLocales();
	const map: Record<string, Record<string, string>> = {};

	// Home pages: /{locale}
	for (const l of locales) {
		const path = `/${l.code}`;
		map[path] ??= {};
		for (const other of locales) {
			map[path][other.code] = `/${other.code}`;
		}
	}

	// Pages: /{locale}/{slug}
	for (const l of locales) {
		const { data: pages } = await fetchStrapi<StrapiCollectionResponse<Page>>(
			"/pages",
			{
				locale: l.code,
				"fields[0]": "slug",
				"populate[localizations][fields][0]": "slug",
				"populate[localizations][fields][1]": "locale",
			},
		);
		for (const page of pages) {
			const path = `/${l.code}/${page.slug}`;
			map[path] ??= {};
			map[path][l.code] = path;
			for (const loc of page.localizations ?? []) {
				map[path][loc.locale] = `/${loc.locale}/${loc.slug}`;
			}
		}
	}

	// Blog posts: /{locale}/blog/{slug}
	for (const l of locales) {
		const { data: posts } = await fetchStrapi<
			StrapiCollectionResponse<BlogPost>
		>("/blog-posts", {
			locale: l.code,
			"fields[0]": "slug",
			"populate[localizations][fields][0]": "slug",
			"populate[localizations][fields][1]": "locale",
		});
		for (const post of posts) {
			const path = `/${l.code}/blog/${post.slug}`;
			map[path] ??= {};
			map[path][l.code] = path;
			for (const loc of post.localizations ?? []) {
				map[path][loc.locale] = `/${loc.locale}/blog/${loc.slug}`;
			}
		}
	}

	return map;
}
