import type { StrapiBlockNode, DynamicZoneComponent } from "./types";

/**
 * Extract plain text from Strapi rich-text block nodes,
 * truncated to a max length suitable for meta descriptions.
 */
function blocksToText(blocks: StrapiBlockNode[]): string {
	const parts: string[] = [];
	for (const block of blocks) {
		if (block.type === "image" || block.type === "heading") continue;
		for (const child of block.children) {
			if (child.type === "text") {
				parts.push(child.text);
			} else if (child.type === "link") {
				for (const t of child.children) {
					parts.push(t.text);
				}
			} else if (child.type === "list-item") {
				for (const t of child.children) {
					if (t.type === "text") parts.push(t.text);
					else if (t.type === "link") {
						for (const lt of t.children) parts.push(lt.text);
					}
				}
			}
		}
	}
	return parts.join(" ").replace(/\s+/g, " ").trim();
}

function truncate(text: string, max: number): string {
	if (text.length <= max) return text;
	const cut = text.lastIndexOf(" ", max);
	return `${text.slice(0, cut > 0 ? cut : max)}…`;
}

/** Extract description from a dynamic zone body (pages / home page). */
export function extractDescriptionFromBody(
	body: DynamicZoneComponent[],
): string | undefined {
	for (const component of body) {
		if (component.__component === "content.rich-text") {
			const text = blocksToText(component.blocks);
			if (text) return truncate(text, 155);
		}
	}
	return undefined;
}

/** Extract description from raw Strapi block nodes (blog posts). */
export function extractDescriptionFromBlocks(
	blocks: StrapiBlockNode[],
): string | undefined {
	const text = blocksToText(blocks);
	return text ? truncate(text, 155) : undefined;
}
