import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: "%s | Garmeres",
		default: "Garmeres",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
