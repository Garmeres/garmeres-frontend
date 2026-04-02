import type { MembershipRegistrationFormComponent } from "@/lib/strapi/types";
import { RichText } from "./rich-text";

export function MembershipRegistrationForm({
	component,
}: {
	component: MembershipRegistrationFormComponent;
}) {
	return (
		<div>
			{component.termsAndConditions && (
				<section
					lang={component.lang}
					className="my-4"
					aria-label="Terms and conditions"
				>
					<div className="overflow-y-scroll max-h-72 bg-slate-100 px-4 py-6 rounded-sm">
						<RichText blocks={component.termsAndConditions} />
					</div>
				</section>
			)}
			<section
				lang={component.lang}
				aria-label="Registration form"
				className="not-prose my-4"
			>
				<iframe
					title="Registration form"
					className="flex flex-col justify-center -mx-2 min-h-[900px] sm:min-h-[770px] lg:min-h-[740px]"
					allowFullScreen
					lang={component.lang}
					src={component.iframeSrc}
					style={{
						width: "100%",
						overflowY: "visible",
					}}
				/>
			</section>
		</div>
	);
}
