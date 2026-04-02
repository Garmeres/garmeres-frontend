import type { DynamicZoneComponent } from "@/lib/strapi/types";
import { Heading } from "./dynamic-zone/heading";
import { Calendar } from "./dynamic-zone/calendar";
import { RichText } from "./dynamic-zone/rich-text";
import { MembershipRegistrationForm } from "./dynamic-zone/membership-registration-form";
import { BlogPosts } from "./dynamic-zone/blog-posts";

export function DynamicZone({
	components,
	locale,
}: {
	components: DynamicZoneComponent[];
	locale: string;
}) {
	return (
		<>
			{components.map((component) => {
				const key = `${component.__component}-${component.id}`;
				switch (component.__component) {
					case "content.rich-text":
						return <RichText key={key} blocks={component.blocks} />;
					case "content.heading":
						return <Heading key={key} component={component} />;
					case "content.calendar":
						return <Calendar key={key} locale={locale} />;
					case "content.blog-posts":
						return (
							<BlogPosts key={key} component={component} locale={locale} />
						);
					case "content.membership-registration-form":
						return (
							<MembershipRegistrationForm key={key} component={component} />
						);
					default:
						return null;
				}
			})}
		</>
	);
}
