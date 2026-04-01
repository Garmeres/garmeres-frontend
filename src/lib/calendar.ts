const CALENDAR_URL = process.env.CALENDAR_URL;

export interface CalendarEvent {
	name: string;
	description: string;
	start: string;
	end: string;
	duration: string;
	location: string;
}

export interface CalendarPage {
	"source-url": string;
	"last-updated": string;
	"events-in-page": number;
	"total-events": number;
	page: number;
	"total-pages": number;
	"per-page": number;
	"has-more": boolean;
	events: CalendarEvent[];
}

export async function getCalendarPage(page = 0): Promise<CalendarPage> {
	if (!CALENDAR_URL) {
		throw new Error("CALENDAR_URL environment variable is not set");
	}
	const res = await fetch(`${CALENDAR_URL}/pages/${page}.json`, {
		cache: "no-store",
	});
	return res.json();
}
