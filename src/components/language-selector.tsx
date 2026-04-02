"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
	const [activeIndex, setActiveIndex] = useState(-1);
	const ref = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLUListElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const pathname = usePathname();

	// Close on outside click
	useEffect(() => {
		if (!open) return;
		function handleClick(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [open]);

	// Focus first item on open, return focus on close
	useEffect(() => {
		if (open) {
			setActiveIndex(0);
		} else {
			setActiveIndex(-1);
		}
	}, [open]);

	// Focus the active menu item
	useEffect(() => {
		if (!open || activeIndex < 0) return;
		const items =
			menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
		items?.[activeIndex]?.focus();
	}, [open, activeIndex]);

	const handleMenuKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setActiveIndex((i) => (i + 1) % locales.length);
					break;
				case "ArrowUp":
					e.preventDefault();
					setActiveIndex((i) => (i - 1 + locales.length) % locales.length);
					break;
				case "Home":
					e.preventDefault();
					setActiveIndex(0);
					break;
				case "End":
					e.preventDefault();
					setActiveIndex(locales.length - 1);
					break;
				case "Escape":
					e.preventDefault();
					setOpen(false);
					buttonRef.current?.focus();
					break;
				case "Tab":
					setOpen(false);
					break;
			}
		},
		[locales.length],
	);

	function getHref(targetLocale: string) {
		const translations = localePathMap[pathname];
		if (translations?.[targetLocale]) return translations[targetLocale];
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
				ref={buttonRef}
				type="button"
				aria-label={currentLocale?.name ?? "Select language"}
				aria-expanded={open}
				aria-haspopup="true"
				className="text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
				onClick={() => setOpen(!open)}
				onKeyDown={(e) => {
					if (e.key === "ArrowDown") {
						e.preventDefault();
						setOpen(true);
					}
				}}
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
					ref={menuRef}
					role="menu"
					onKeyDown={handleMenuKeyDown}
					className="absolute right-0 top-full mt-2 bg-zinc-900 border border-zinc-700 rounded shadow-lg py-1 min-w-[180px] z-50"
				>
					{locales.map((l, index) => (
						<li key={l.code} role="none">
							<a
								role="menuitem"
								tabIndex={index === activeIndex ? 0 : -1}
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
