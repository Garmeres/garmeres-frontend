import { getContact, getLocales, getSocialMediaLinks } from "@/lib/strapi";
import Image from "next/image";

const footerLabels = {
	no: {
		email: "E-post",
		vipps: "Vipps",
		bankAccount: "Kontonr",
		orgNumber: "Org.nr",
	},
	en: {
		email: "E-mail",
		vipps: "Vipps",
		bankAccount: "Account number",
		orgNumber: "Organisation number",
	},
	se: {
		email: "E-boasta",
		vipps: "Vipps",
		bankAccount: "Kontonr",
		orgNumber: "Org.nr",
	},
} as const;

export async function Footer({ locale }: { locale: string }) {
	const [{ data: contact }, { data: socialLinks }, locales] = await Promise.all(
		[getContact(), getSocialMediaLinks(), getLocales()],
	);

	const defaultLocale =
		locales.find((l) => l.isDefault)?.code ?? locales[0]?.code;
	const labels =
		footerLabels[locale as keyof typeof footerLabels] ??
		footerLabels[defaultLocale as keyof typeof footerLabels];

	return (
		<footer className="flex flex-col justify-center items-center gap-4 bg-zinc-800 py-8 px-8 text-white">
			<div className="flex flex-row gap-8 justify-center">
				{socialLinks.map((link) => (
					<a
						key={link.documentId}
						aria-label={link.name}
						href={link.url}
						rel="nofollow"
						target="_blank"
						className="text-white"
					>
						<Image src={link.icon.url} alt={link.name} width={28} height={28} />
					</a>
				))}
			</div>
			<p>
				{labels.email}:{" "}
				<a href={`mailto:${contact.email}`} className="underline">
					{contact.email}
				</a>
			</p>
			<p>
				{labels.vipps}: {contact.vipps}
			</p>
			<p>
				{labels.bankAccount}: {contact.bankAccount}
			</p>
			<p>
				{labels.orgNumber}: {contact.organisationNumber}
			</p>
		</footer>
	);
}
