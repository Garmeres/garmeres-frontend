import { getLocales } from "@/lib/strapi";
import { redirect } from "next/navigation";

export default async function RootPage() {
	const locales = await getLocales();
	const defaultLocale = locales.find((l) => l.isDefault) ?? locales[0];
	redirect(`/${defaultLocale.code}`);
}
