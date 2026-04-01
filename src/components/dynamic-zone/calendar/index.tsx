import { getCalendarPage } from "@/lib/calendar";
import { CalendarEvents } from "./calendar-events";

export async function Calendar({ locale }: { locale: string }) {
	const page = await getCalendarPage(0);
	return <CalendarEvents page={page} locale={locale} />;
}
