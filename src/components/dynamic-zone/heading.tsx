import type { HeadingComponent } from "@/lib/strapi/types";

const alignmentClass = {
	left: "text-left",
	middle: "text-center",
	right: "text-right",
} as const;

export function Heading({ component }: { component: HeadingComponent }) {
	const Tag = component.level;
	const align = alignmentClass[component.alignment] ?? "text-left";
	const className = component.visible ? align : "sr-only";

	return <Tag className={className}>{component.text}</Tag>;
}
