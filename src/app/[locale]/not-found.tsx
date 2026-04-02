"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const translations = {
	se: {
		title: "Siidu ii gávdno",
		description: "Várra lea siidu sirdán, dahje URL leat boastut čállán.",
		home: "Mana ruoktusiidui",
	},
	en: {
		title: "Page not found",
		description: "It might have been moved, or the URL could be wrong.",
		home: "Return home",
	},
	no: {
		title: "Siden finnes ikke",
		description: "Den kan ha blitt flyttet, eller nettadressen kan være feil.",
		home: "Gå til forsiden",
	},
} as const;

type Locale = keyof typeof translations;

export default function NotFound() {
	const pathname = usePathname();
	const segment = pathname.split("/")[1];
	const locale: Locale = segment in translations ? (segment as Locale) : "se";
	const t = translations[locale];

	return (
		<div className="prose max-w-[1024px] flex flex-col w-full mx-auto px-6 md:px-12 xl:px-16 pt-16 pb-32 bg-white flex-grow h-full text-black">
			<h1>{t.title}</h1>
			<p>{t.description}</p>
			<p>
				<Link href={`/${locale}`}>{t.home}</Link>
			</p>
		</div>
	);
}
