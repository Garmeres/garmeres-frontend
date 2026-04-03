import type { ImageLoaderProps } from "next/image";

/**
 * Custom image loader that maps Next.js width requests to Strapi's
 * pre-generated responsive format URLs on S3.
 *
 * Strapi generates: thumbnail (245px), small (500px), medium (750px), large (1000px).
 * The format URLs follow the pattern: {base}/{format}_{filename}
 *
 * This serves images directly from S3 — no proxy through the pod.
 */
export default function strapiImageLoader({ src, width }: ImageLoaderProps) {
	// Local images (e.g. /garmeres-logo-small.png) — serve as-is
	if (src.startsWith("/")) {
		return src;
	}

	// SVGs are vector — no responsive formats exist, serve as-is
	if (src.endsWith(".svg")) {
		return src;
	}

	// Pick the smallest Strapi format that covers the requested width
	let prefix: string | null = null;
	if (width <= 245) {
		prefix = "thumbnail";
	} else if (width <= 500) {
		prefix = "small";
	} else if (width <= 750) {
		prefix = "medium";
	} else if (width <= 1000) {
		prefix = "large";
	}
	// width > 1000: use the original (no prefix)

	if (!prefix) {
		return src;
	}

	// Transform https://host/image.jpg → https://host/thumbnail_image.jpg
	const lastSlash = src.lastIndexOf("/");
	if (lastSlash === -1) {
		return src;
	}

	const base = src.substring(0, lastSlash + 1);
	const filename = src.substring(lastSlash + 1);
	return `${base}${prefix}_${filename}`;
}
