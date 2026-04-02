import { getLocales } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CookieConsent } from "@/components/cookie-consent";
import "../globals.css";

export async function generateStaticParams() {
	const locales = await getLocales();
	return locales.map((locale) => ({ locale: locale.code }));
}

export default async function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const locales = await getLocales();
	if (!locales.some((l) => l.code === locale)) notFound();

	return (
		<html lang={locale} className="h-full antialiased">
			<body className="min-h-full flex flex-col overflow-x-hidden">
				<div className="flex flex-col min-h-screen">
					<a
						href="#main-content"
						className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
					>
						{locale === "no"
							? "Hopp til innhold"
							: locale === "se"
								? "Njuike sisdollui"
								: "Skip to content"}
					</a>
					<Header locale={locale} />
					<main id="main-content" className="flex-1 flex flex-col">
						{children}
					</main>
					<Footer locale={locale} />
					<CookieConsent locale={locale} />
				</div>
			</body>
		</html>
	);
}
