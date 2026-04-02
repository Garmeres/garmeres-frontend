"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface LocaleInfo {
	code: string;
	name: string;
}

export function LanguageSelector({
	locale,
	locales,
	localePathMap,
}: {
	locale: string;
	locales: LocaleInfo[];
	localePathMap: Record<string, Record<string, string>>;
}) {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	// Close on outside click
	useEffect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open]);

	function getHref(targetLocale: string) {
		const translations = localePathMap[pathname];
		if (translations?.[targetLocale]) return translations[targetLocale];
		// Encode all available translations so the not-available page can list them
		const available = translations
			? Object.entries(translations)
					.map(([l, p]) => `${l}:${encodeURIComponent(p)}`)
					.join(",")
			: "";
		return `/${targetLocale}/not-available?available=${available}`;
	}

	const currentLocale = locales.find((l) => l.code === locale);

	return (
		<div ref={ref} className="relative flex items-center">
			<button
				type="button"
				aria-label={currentLocale?.name ?? "Select language"}
				aria-expanded={open}
				aria-haspopup="true"
				className="text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
				onClick={() => setOpen(!open)}
			>
				<Image
					src="/globe.svg"
					alt=""
					width={24}
					height={24}
					aria-hidden="true"
				/>
			</button>

			{open && (
				<ul
					role="menu"
					className="absolute right-0 top-full mt-2 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 min-w-[180px] z-50"
				>
					{locales.map((l) => (
						<li key={l.code} role="none">
							<a
								role="menuitem"
								lang={l.code}
								href={getHref(l.code)}
								className={`block px-4 py-2 text-sm no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white ${
									l.code === locale
										? "font-bold text-white bg-zinc-700"
										: "text-zinc-300 hover:bg-zinc-700"
								}`}
								onClick={() => setOpen(false)}
							>
								{l.name}
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
