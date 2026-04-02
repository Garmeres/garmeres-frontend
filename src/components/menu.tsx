"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface MenuItem {
	name: string;
	slug: string;
}

const menuLabels: Record<string, { open: string; close: string }> = {
	en: { open: "Open menu", close: "Close menu" },
	no: { open: "Åpne meny", close: "Lukk meny" },
	se: { open: "Rahpat fálu", close: "Gidde fálu" },
};

export function Menu({
	locale,
	menuItems,
	homePageName,
}: {
	locale: string;
	menuItems: MenuItem[];
	homePageName: string;
}) {
	const [open, setOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const navRef = useRef<HTMLElement>(null);
	const labels = menuLabels[locale] ?? menuLabels.en;

	// Focus close button on open, return focus to trigger on close
	const prevOpen = useRef(false);
	useEffect(() => {
		if (open && !prevOpen.current) {
			closeRef.current?.focus();
		} else if (!open && prevOpen.current) {
			triggerRef.current?.focus();
		}
		prevOpen.current = open;
	}, [open]);

	// Focus trap + Escape
	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Escape") {
			setOpen(false);
			return;
		}
		if (e.key === "Tab" && navRef.current) {
			const focusable = navRef.current.querySelectorAll<HTMLElement>(
				'button, a[href], [tabindex]:not([tabindex="-1"])',
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}, []);

	useEffect(() => {
		if (open) {
			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}
	}, [open, handleKeyDown]);

	return (
		<div className="relative">
			{/* Backdrop */}
			{/* biome-ignore lint: intentional non-interactive backdrop */}
			<div
				role="presentation"
				className="fixed inset-0 bg-black/40 z-40 transition-[opacity,visibility] duration-300"
				style={{
					opacity: open ? 1 : 0,
					visibility: open ? "visible" : "hidden",
				}}
				onClick={() => setOpen(false)}
			/>

			{/* Hamburger button */}
			<button
				ref={triggerRef}
				type="button"
				aria-label={open ? labels.close : labels.open}
				className="text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
				onClick={() => setOpen(!open)}
			>
				<svg
					stroke="currentColor"
					fill="none"
					strokeWidth="0"
					viewBox="0 0 15 15"
					height="24"
					width="24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
						fill="currentColor"
					/>
				</svg>
			</button>

			{/* Slide-out nav panel */}
			<nav
				ref={navRef}
				className="fixed flex flex-col top-0 right-0 bottom-0 max-h-screen w-72 bg-zinc-800 shadow-xl transition-[transform,visibility] duration-300 z-50"
				style={{
					transform: open ? "translateX(0)" : "translateX(100%)",
					visibility: open ? "visible" : "hidden",
				}}
			>
				{/* Close button */}
				<div className="flex justify-end px-4 py-4">
					<button
						ref={closeRef}
						type="button"
						aria-label={labels.close}
						className="text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded hover:bg-zinc-700"
						onClick={() => setOpen(false)}
					>
						<svg
							stroke="currentColor"
							fill="none"
							strokeWidth="0"
							viewBox="0 0 15 15"
							height="20"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								clipRule="evenodd"
								d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
								fill="currentColor"
							/>
						</svg>
					</button>
				</div>

				{/* Menu items */}
				<ul className="flex flex-col px-4 py-2 gap-3">
					<li key="home">
						<Link
							href={`/${locale}`}
							className="block px-4 py-2.5 text-sm text-white no-underline rounded hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
							onClick={() => setOpen(false)}
						>
							{homePageName}
						</Link>
					</li>
					{menuItems.map((item) => (
						<li key={item.slug}>
							<Link
								href={`/${locale}/${item.slug}`}
								className="block px-4 py-2.5 text-sm text-white no-underline rounded hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
								onClick={() => setOpen(false)}
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
