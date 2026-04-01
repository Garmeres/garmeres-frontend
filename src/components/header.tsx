import Image from "next/image";
import Link from "next/link";
import {
	getMenuPages,
	getHomePage,
	getLocales,
	getLocalePathMap,
} from "@/lib/strapi";
import { Menu } from "./menu";
import { LanguageSelector } from "./language-selector";

export async function Header({ locale }: { locale: string }) {
	const [menuPagesRes, homePageRes, locales, localePathMap] = await Promise.all(
		[
			getMenuPages(locale),
			getHomePage(locale),
			getLocales(),
			getLocalePathMap(),
		],
	);

	const menuItems = menuPagesRes.data.map((p) => ({
		name: p.name,
		slug: p.slug,
	}));

	return (
		<header className="relative z-10 w-full bg-zinc-800 flex flex-row justify-between shadow-lg px-2 xl:px-6 py-2 xl:py-3">
			<Link
				href={`/${locale}`}
				className="flex text-white flex-row gap-4 xl:gap-6 no-underline items-center"
			>
				<Image
					src="/garmeres-logo.svg"
					alt=""
					width={70}
					height={70}
					className="rounded w-[55px] xl:w-[65px]"
				/>
				<span className="text-2xl xl:text-3xl font-extralight">Garmeres</span>
			</Link>
			<div className="flex flex-row items-center gap-4 xl:gap-6">
				<LanguageSelector
					locale={locale}
					locales={locales.map((l) => ({ code: l.code, name: l.name }))}
					localePathMap={localePathMap}
				/>
				<Menu
					locale={locale}
					menuItems={menuItems}
					homePageName={homePageRes.data.name}
				/>
			</div>
		</header>
	);
}
