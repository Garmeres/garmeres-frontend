import { getLocales } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

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
		<div lang={locale} className="flex flex-col min-h-screen">
			<Header locale={locale} />
			<main className="flex-1 flex flex-col">{children}</main>
			<Footer locale={locale} />
		</div>
	);
}
