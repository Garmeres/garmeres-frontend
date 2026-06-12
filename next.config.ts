import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		loader: "custom",
		loaderFile: "./src/lib/strapi/image-loader.ts",
	},
	async rewrites() {
		const uploadsProxy = process.env.STRAPI_UPLOADS_PROXY;
		if (!uploadsProxy) return [];
		return [
			{
				source: "/uploads/:path*",
				destination: `${uploadsProxy}/uploads/:path*`,
			},
		];
	},
};

export default nextConfig;
