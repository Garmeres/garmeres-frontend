import type { ImageLoaderProps } from "next/image";

/**
 * Custom image loader that maps Next.js width requests to Strapi's
 * pre-generated responsive format URLs on S3.
 *
 * Strapi generates: thumbnail (245px), small (500px), medium (750px), large (1000px).
 * The format URLs follow the pattern: /uploads/{format}_{filename}
 *
 * This serves images directly from S3 — no proxy through the pod.
 */
export default function strapiImageLoader({ src, width }: ImageLoaderProps) {
	// Local images (e.g. /garmeres-logo-small.png) — serve as-is
	if (src.startsWith("/")) {
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

	// Transform /uploads/image.jpg → /uploads/thumbnail_image.jpg
	const uploadsIndex = src.lastIndexOf("/uploads/");
	if (uploadsIndex === -1) {
		return src;
	}

	const base = src.substring(0, uploadsIndex + "/uploads/".length);
	const filename = src.substring(uploadsIndex + "/uploads/".length);
	return `${base}${prefix}_${filename}`;
}
