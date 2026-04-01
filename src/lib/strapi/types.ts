// Strapi locale
export interface Locale {
	id: number;
	documentId: string;
	code: string;
	name: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

// Strapi media format
export interface StrapiMediaFormat {
	url: string;
	width: number;
	height: number;
	name: string;
	hash: string;
	ext: string;
	mime: string;
	size: number;
}

export interface StrapiMedia {
	id: number;
	documentId: string;
	url: string;
	alternativeText: string | null;
	caption: string | null;
	width: number;
	height: number;
	formats: {
		thumbnail?: StrapiMediaFormat;
		small?: StrapiMediaFormat;
		medium?: StrapiMediaFormat;
		large?: StrapiMediaFormat;
	} | null;
	name: string;
	mime: string;
}

// Strapi blocks (rich text) types
export type StrapiBlockNode =
	| StrapiParagraphBlock
	| StrapiHeadingBlock
	| StrapiListBlock
	| StrapiQuoteBlock
	| StrapiCodeBlock
	| StrapiImageBlock;

export interface StrapiParagraphBlock {
	type: "paragraph";
	children: StrapiInlineNode[];
}

export interface StrapiHeadingBlock {
	type: "heading";
	level: 1 | 2 | 3 | 4 | 5 | 6;
	children: StrapiInlineNode[];
}

export interface StrapiListBlock {
	type: "list";
	format: "ordered" | "unordered";
	children: StrapiListItemNode[];
}

export interface StrapiListItemNode {
	type: "list-item";
	children: StrapiInlineNode[];
}

export interface StrapiQuoteBlock {
	type: "quote";
	children: StrapiInlineNode[];
}

export interface StrapiCodeBlock {
	type: "code";
	children: StrapiInlineNode[];
}

export interface StrapiImageBlock {
	type: "image";
	image: StrapiMedia;
	children: StrapiInlineNode[];
}

export interface StrapiTextNode {
	type: "text";
	text: string;
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	code?: boolean;
}

export interface StrapiLinkNode {
	type: "link";
	url: string;
	children: StrapiTextNode[];
}

export type StrapiInlineNode = StrapiTextNode | StrapiLinkNode;

// Dynamic zone component types
export interface RichTextComponent {
	__component: "content.rich-text";
	id: number;
	blocks: StrapiBlockNode[];
}

export interface HeadingComponent {
	__component: "content.heading";
	id: number;
	text: string;
	level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	visible: boolean;
	alignment: "left" | "middle" | "right";
}

export interface CalendarComponent {
	__component: "content.calendar";
	id: number;
	updatedAtLabel: string;
}

export interface BlogPostsComponent {
	__component: "content.blog-posts";
	id: number;
	loadMoreButtonText: string;
	loadingMessage: string;
}

export interface MembershipRegistrationFormComponent {
	__component: "content.membership-registration-form";
	id: number;
	lang: "no" | "en" | "se";
	iframeSrc: string;
	termsAndConditions: StrapiBlockNode[] | null;
}

export type DynamicZoneComponent =
	| RichTextComponent
	| HeadingComponent
	| CalendarComponent
	| BlogPostsComponent
	| MembershipRegistrationFormComponent;

// Content types
export interface HomePage {
	id: number;
	documentId: string;
	name: string;
	title: string;
	subtitle: string;
	bannerImage: StrapiMedia;
	bannerButtonText: string;
	bannerButtonLink: Page | null;
	body: DynamicZoneComponent[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	locale: string;
}

export interface Page {
	id: number;
	documentId: string;
	backgroundImage: StrapiMedia | null;
	name: string;
	slug: string;
	showInMenu: boolean;
	menuIndex: number;
	body: DynamicZoneComponent[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	locale: string;
}

export interface BlogPost {
	id: number;
	documentId: string;
	thumbnail: StrapiMedia | null;
	title: string;
	slug: string;
	body: StrapiBlockNode[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	locale: string;
}

export interface SocialMedia {
	id: number;
	documentId: string;
	name: string;
	icon: StrapiMedia;
	url: string;
	index: number;
	createdAt: string;
	updatedAt: string;
}

export interface Contact {
	id: number;
	documentId: string;
	organisationName: string;
	organisationNumber: string;
	email: string;
	address: string;
	vipps: string;
	bankAccount: string;
	iban: string;
	swift: string;
	createdAt: string;
	updatedAt: string;
}

// Strapi API response wrappers
export interface StrapiSingleResponse<T> {
	data: T;
	meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
	data: T[];
	meta: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}
