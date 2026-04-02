import type { DynamicZoneComponent } from "@/lib/strapi/types";
import { Heading } from "./dynamic-zone/heading";
import { Calendar } from "./dynamic-zone/calendar";
import { RichText } from "./dynamic-zone/rich-text";

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
						return <div key={key}>{/* BlogPosts */}</div>;
					case "content.membership-registration-form":
						return <div key={key}>{/* MembershipRegistrationForm */}</div>;
					default:
						return null;
				}
			})}
		</>
	);
}
