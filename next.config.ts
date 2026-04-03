import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		loader: "custom",
		loaderFile: "./src/lib/strapi/image-loader.ts",
	},
};

export default nextConfig;
