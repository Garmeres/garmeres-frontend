import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "strapi.balve.garmeres.com",
			},
			{
				protocol: "https",
				hostname: "balve-strapi.hel1.your-objectstorage.com",
			},
		],
	},
};

export default nextConfig;
