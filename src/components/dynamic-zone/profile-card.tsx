import Image from "next/image";
import type { ProfileCardComponent } from "@/lib/strapi/types";

export function ProfileCard({
	component,
}: {
	component: ProfileCardComponent;
}) {
	const { name, title, email, pronouns, description, image } = component;

	return (
		<article className="not-prose flex flex-col items-center sm:items-start gap-6 py-16">
			<div className="flex flex-col sm:flex-row items-center sm:items-center gap-12">
				<div className="relative w-40 h-40 rounded-full overflow-hidden shrink-0 bg-zinc-200">
					{image?.url ? (
						<Image
							src={image.url}
							alt=""
							fill
							sizes="160px"
							className="object-cover"
						/>
					) : (
						<img
							src="/person.svg"
							alt=""
							className="w-full h-full object-contain p-6"
						/>
					)}
				</div>
				<div className="flex flex-col items-center sm:items-start text-center sm:text-left [&>*]:m-0 gap-3">
					<p className="text-lg font-bold">{name}</p>
					{title && <p className="text-sm">{title}</p>}
					{pronouns && <p className="text-sm">{pronouns}</p>}
					{email && (
						<a
							href={`mailto:${email}`}
							className="text-sm underline underline-offset-2"
						>
							{email}
						</a>
					)}
				</div>
			</div>
			{description && (
				<p className="text-sm whitespace-pre-line text-center sm:text-left">
					{description}
				</p>
			)}
		</article>
	);
}
