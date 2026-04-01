import Image from "next/image";
import Link from "next/link";
import { getMenuPages, getHomePage } from "@/lib/strapi";
import { Menu } from "./menu";

export async function Header({ locale }: { locale: string }) {
	const [menuPagesRes, homePageRes] = await Promise.all([
		getMenuPages(locale),
		getHomePage(locale),
	]);

	const menuItems = menuPagesRes.data.map((p) => ({
		name: p.name,
		slug: p.slug,
	}));

	return (
		<header className="w-full bg-zinc-800 flex flex-row justify-between shadow-lg px-2 xl:px-6 py-2 xl:py-3">
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
			<Menu
				locale={locale}
				menuItems={menuItems}
				homePageName={homePageRes.data.name}
			/>
		</header>
	);
}
