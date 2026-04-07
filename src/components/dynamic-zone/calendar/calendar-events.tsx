import type { CalendarPage } from "@/lib/calendar";
import { CalendarEventItem } from "./calendar-event";

function formatDatetime(iso: string) {
	return iso.replace("T", " ").slice(0, 16);
}

const updatedLabel: Record<string, string> = {
	en: "Last updated",
	no: "Sist oppdatert",
	se: "Ođasmahtton",
};

const emptyMessage: Record<string, string> = {
	en: "No upcoming events",
	no: "Ingen kommende hendelser",
	se: "Eai leat boahttevaš dáhpáhusat",
};

export function CalendarEvents({
	page,
	locale,
}: {
	page: CalendarPage;
	locale: string;
}) {
	return (
		<div className="not-prose flex flex-col items-center mx-auto gap-6 w-full max-w-[640px] mb-16">
			<div className="w-full divide-y divide-zinc-200 shadow-lg border-zinc-200 border-1 shadow-black/[0.2]">
				{page.events.length > 0 ? (
					page.events.map((event, i) => (
						<CalendarEventItem key={i} event={event} locale={locale} />
					))
				) : (
					<p className="p-4 text-center text-zinc-500">
						{emptyMessage[locale] ?? emptyMessage.en}
					</p>
				)}
			</div>

			<p className="text-sm text-zinc-500">
				{updatedLabel[locale] ?? updatedLabel.en}{" "}
				{formatDatetime(page["last-updated"])}
			</p>
		</div>
	);
}
