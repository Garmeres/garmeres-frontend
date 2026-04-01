import Link from "next/link";

const messages: Record<
	string,
	{ heading: string; body: string; home: string }
> = {
	en: {
		heading: "Translation not available",
		body: "This content is not available in English. It is available in the following languages:",
		home: "Go to the home page",
	},
	no: {
		heading: "Oversettelse ikke tilgjengelig",
		body: "Dette innholdet er ikke tilgjengelig på norsk. Det finnes på følgende språk:",
		home: "Gå til forsiden",
	},
	se: {
		heading: "Jorgalus ii gávdno",
		body: "Dát sisdoallu ii gávdno davvisámegillii. Dat gávdno čuovvovaš gielain:",
		home: "Mana ruoktusiidui",
	},
};

const localeNames: Record<string, string> = {
	en: "English",
	no: "Norsk Bokmål",
	se: "Davvisámegiella",
};

export default async function NotAvailablePage({
	params,
	searchParams,
}: {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ available?: string }>;
}) {
	const { locale } = await params;
	const { available } = await searchParams;
	const t = messages[locale] ?? messages.en;

	// Parse available translations: "en:/en/some-page,se:/se/some-page"
	const links: { locale: string; name: string; href: string }[] = [];
	if (available) {
		for (const entry of available.split(",")) {
			const colonIdx = entry.indexOf(":");
			if (colonIdx === -1) continue;
			const l = entry.slice(0, colonIdx);
			const href = decodeURIComponent(entry.slice(colonIdx + 1));
			if (l !== locale) {
				links.push({ locale: l, name: localeNames[l] ?? l, href });
			}
		}
	}

	return (
		<div className="prose max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
			<h1>{t.heading}</h1>
			<p>{t.body}</p>
			{links.length > 0 && (
				<ul>
					{links.map((link) => (
						<li key={link.locale}>
							<Link href={link.href} lang={link.locale}>
								{link.name}
							</Link>
						</li>
					))}
				</ul>
			)}
			<p>
				<Link href={`/${locale}`}>{t.home}</Link>
			</p>
		</div>
	);
}
