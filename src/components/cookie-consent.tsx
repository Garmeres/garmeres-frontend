"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const CONSENT_COOKIE = "ga_consent";
const GA_ID = "G-D4DKCE7RH0";
const COOKIE_MAX_AGE = 28 * 24 * 60 * 60; // 28 days in seconds

function getCookie(name: string): string | undefined {
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : undefined;
}

function setCookie(name: string, value: string, maxAge: number) {
	document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

function deleteGACookies() {
	document.cookie.split(";").forEach((c) => {
		const name = c.trim().split("=")[0];
		if (name.startsWith("_ga") && name !== CONSENT_COOKIE) {
			document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
		}
	});
}

const translations: Record<
	string,
	{
		heading: string;
		description: string;
		privacyLink: string;
		accept: string;
		reject: string;
	}
> = {
	se: {
		heading: "Diehtočoahkku mieđáhus",
		description:
			"Mii čohkket namahis dáhtat gehččiidlogut birra Google Analytics 4 diehtočoahkuiguin. Eambbo informašuvnna oainnát ",
		privacyLink: "privacy policy (English).",
		accept: "Mun dohkkehan visot",
		reject: "Dušše dárbbašlaččat",
	},
	en: {
		heading: "Cookie consent",
		description:
			"We use cookies to collect anonymous analytics data using Google Analytics 4. For more information, see our ",
		privacyLink: "privacy policy.",
		accept: "Accept all",
		reject: "Required only",
	},
	no: {
		heading: "Informasjonskapsler",
		description:
			"Vi bruker informasjonskapsler for å samle inn anonyme analysedata med Google Analytics 4. For mer informasjon, se vår ",
		privacyLink: "personvernerklæring.",
		accept: "Godta alle",
		reject: "Bare nødvendige",
	},
};

const privacyLinks: Record<string, string> = {
	se: "/en/privacy-policy",
	en: "/en/privacy-policy",
	no: "/no/personvernserklaering",
};

export function CookieConsent({ locale }: { locale: string }) {
	const [consent, setConsent] = useState<boolean | null>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const value = getCookie(CONSENT_COOKIE);
		if (value === "true") setConsent(true);
		else if (value === "false") setConsent(false);
		setLoaded(true);
	}, []);

	function handleResponse(accepted: boolean) {
		setCookie(CONSENT_COOKIE, String(accepted), COOKIE_MAX_AGE);
		setConsent(accepted);
		if (!accepted) {
			deleteGACookies();
		}
	}

	const t = translations[locale] ?? translations.en;
	const privacyHref = privacyLinks[locale] ?? privacyLinks.en;

	// Don't render anything until we've checked localStorage
	if (!loaded) return null;

	// Consent already given
	if (consent !== null) {
		return consent ? (
			<>
				<Script
					src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
					strategy="afterInteractive"
				/>
				<Script id="gtag-init" strategy="afterInteractive">
					{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
				</Script>
			</>
		) : null;
	}

	// Show banner
	return (
		<div
			className="fixed bottom-0 inset-x-0 z-50 bg-zinc-800 text-white px-6 py-6 shadow-[0_-2px_12px_rgba(0,0,0,0.3)]"
			role="dialog"
			aria-labelledby="cookie-heading"
		>
			<div className="max-w-[1024px] mx-auto flex flex-col gap-4">
				<h2 id="cookie-heading" className="text-base font-medium">
					{t.heading}
				</h2>
				<p className="text-sm leading-6 text-zinc-300">
					{t.description}
					<a
						href={privacyHref}
						className="text-blue-300 hover:underline no-underline"
					>
						{t.privacyLink}
					</a>
				</p>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={() => handleResponse(true)}
						className="px-5 py-2 text-sm rounded bg-white text-zinc-900 hover:bg-zinc-200 transition-colors"
					>
						{t.accept}
					</button>
					<button
						type="button"
						onClick={() => handleResponse(false)}
						className="px-5 py-2 text-sm rounded text-zinc-300 hover:text-white transition-colors"
					>
						{t.reject}
					</button>
				</div>
			</div>
		</div>
	);
}
