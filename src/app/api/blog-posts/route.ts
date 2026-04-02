import { getBlogPosts } from "@/lib/strapi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const locale = request.nextUrl.searchParams.get("locale");
	const page = request.nextUrl.searchParams.get("page");

	if (!locale || !page) {
		return NextResponse.json(
			{ error: "Missing locale or page parameter" },
			{ status: 400 },
		);
	}

	const pageNum = parseInt(page, 10);
	if (Number.isNaN(pageNum) || pageNum < 1) {
		return NextResponse.json(
			{ error: "Invalid page parameter" },
			{ status: 400 },
		);
	}

	const result = await getBlogPosts(locale, pageNum, 6);
	return NextResponse.json(result);
}
