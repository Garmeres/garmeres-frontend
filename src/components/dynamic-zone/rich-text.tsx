import Image from "next/image";
import type {
	StrapiBlockNode,
	StrapiInlineNode,
	StrapiTextNode,
	StrapiLinkNode,
	StrapiListItemNode,
} from "@/lib/strapi/types";

function InlineNode({ node }: { node: StrapiInlineNode }) {
	if (node.type === "link") {
		return (
			<a href={(node as StrapiLinkNode).url}>
				{(node as StrapiLinkNode).children.map((child, i) => (
					<TextNode key={i} node={child} />
				))}
			</a>
		);
	}
	return <TextNode node={node as StrapiTextNode} />;
}

function TextNode({ node }: { node: StrapiTextNode }) {
	const parts = node.text.split("\n");
	let el: React.ReactNode =
		parts.length > 1
			? parts.map((part, i) => (
					<span key={i}>
						{i > 0 && <br />}
						{part}
					</span>
				))
			: node.text;
	if (node.bold) el = <strong>{el}</strong>;
	if (node.italic) el = <em>{el}</em>;
	if (node.underline) el = <u>{el}</u>;
	if (node.strikethrough) el = <s>{el}</s>;
	if (node.code) el = <code>{el}</code>;
	return <>{el}</>;
}

function BlockNode({ node }: { node: StrapiBlockNode }) {
	switch (node.type) {
		case "paragraph":
			return (
				<p>
					{node.children.map((child, i) => (
						<InlineNode key={i} node={child} />
					))}
				</p>
			);
		case "heading": {
			const Tag = `h${node.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
			return (
				<Tag>
					{node.children.map((child, i) => (
						<InlineNode key={i} node={child} />
					))}
				</Tag>
			);
		}
		case "list": {
			const Tag = node.format === "ordered" ? "ol" : "ul";
			return (
				<Tag>
					{node.children.map((item: StrapiListItemNode, i: number) => (
						<li key={i}>
							{item.children.map((child, j) => (
								<InlineNode key={j} node={child} />
							))}
						</li>
					))}
				</Tag>
			);
		}
		case "quote":
			return (
				<blockquote>
					{node.children.map((child, i) => (
						<InlineNode key={i} node={child} />
					))}
				</blockquote>
			);
		case "code":
			return (
				<pre>
					<code>
						{node.children.map((child, i) => (
							<InlineNode key={i} node={child} />
						))}
					</code>
				</pre>
			);
		case "image":
			return (
				<Image
					src={node.image.url}
					alt={node.image.alternativeText ?? ""}
					width={node.image.width}
					height={node.image.height}
				/>
			);
		default:
			return null;
	}
}

export function RichText({ blocks }: { blocks: StrapiBlockNode[] }) {
	return (
		<>
			{blocks.map((block, i) => (
				<BlockNode key={i} node={block} />
			))}
		</>
	);
}
