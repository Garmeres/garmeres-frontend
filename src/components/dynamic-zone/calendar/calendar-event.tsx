import type { CalendarEvent as CalendarEventType } from "@/lib/calendar";
import { DateIcon } from "./date-icon";
import {
	IoLocationOutline,
	IoTimeOutline,
	IoTimerOutline,
} from "react-icons/io5";

function parseDuration(iso: string) {
	const m = iso.match(
		/P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/,
	);
	if (!m)
		return {
			years: 0,
			months: 0,
			weeks: 0,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		};
	return {
		years: parseInt(m[1] || "0"),
		months: parseInt(m[2] || "0"),
		weeks: parseInt(m[3] || "0"),
		days: parseInt(m[4] || "0"),
		hours: parseInt(m[5] || "0"),
		minutes: parseInt(m[6] || "0"),
		seconds: parseInt(m[7] || "0"),
	};
}

function isMultiDay(iso: string) {
	const { years, months, weeks, days } = parseDuration(iso);
	return years > 0 || months > 0 || weeks > 0 || days >= 1;
}

function getTimeString(iso: string) {
	if (!iso.includes("T")) return null;
	const d = new Date(iso);
	return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

function getEventTimeRange(start: string, end: string, duration: string) {
	if (isMultiDay(duration)) return null;
	const s = getTimeString(start);
	const e = getTimeString(end);
	if (!s || !e) return null;
	return `${s} – ${e}`;
}

type TimeUnit =
	| "years"
	| "months"
	| "weeks"
	| "days"
	| "hours"
	| "minutes"
	| "seconds";

const unitLabels: Record<TimeUnit, Record<string, [string, string]>> = {
	years: { en: ["year", "years"], no: ["år", "år"], se: ["jahki", "jagit"] },
	months: {
		en: ["month", "months"],
		no: ["måned", "måneder"],
		se: ["mánnu", "mánut"],
	},
	weeks: {
		en: ["week", "weeks"],
		no: ["uke", "uker"],
		se: ["vahkku", "vahkut"],
	},
	days: {
		en: ["day", "days"],
		no: ["dag", "dager"],
		se: ["beaivi", "beaivvit"],
	},
	hours: {
		en: ["hour", "hours"],
		no: ["time", "timer"],
		se: ["diibmu", "diimmut"],
	},
	minutes: {
		en: ["minute", "minutes"],
		no: ["minutt", "minutter"],
		se: ["minuhtta", "minuhtat"],
	},
	seconds: {
		en: ["second", "seconds"],
		no: ["sekund", "sekunder"],
		se: ["sekunda", "sekunddat"],
	},
};

function getDurationString(iso: string, locale: string) {
	if (!isMultiDay(iso)) return null;
	const parsed = parseDuration(iso);
	const parts: string[] = [];
	for (const key of [
		"years",
		"months",
		"weeks",
		"days",
		"hours",
		"minutes",
		"seconds",
	] as TimeUnit[]) {
		const value = parsed[key];
		if (value > 0) {
			const [singular, plural] = unitLabels[key][locale] ?? unitLabels[key].en;
			parts.push(`${value} ${value === 1 ? singular : plural}`);
		}
	}
	return parts.length > 0 ? parts.join(", ") : null;
}

const labels: Record<string, Record<string, string>> = {
	time: { en: "Time", no: "Tid", se: "Áigi" },
	duration: { en: "Duration", no: "Varighet", se: "Bistu" },
	location: { en: "Location", no: "Sted", se: "Sadji" },
};

export function CalendarEventItem({
	event,
	locale,
}: {
	event: CalendarEventType;
	locale: string;
}) {
	const timeRange = getEventTimeRange(event.start, event.end, event.duration);
	const durationString = getDurationString(event.duration, locale);
	const hasDetails = event.location || event.description;

	return (
		<details className="group">
			<summary className="flex flex-row w-full items-center py-3 px-4 text-left gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
				<DateIcon locale={locale} dateIso={event.start} />
				<div className="flex flex-col flex-grow gap-1">
					<h3 className="text-base font-medium">{event.name}</h3>
					{timeRange && (
						<div
							className="flex flex-row items-center gap-1"
							aria-label={`${labels.time[locale] ?? labels.time.en}: ${timeRange}`}
						>
							<IoTimeOutline size={16} aria-hidden="true" />
							<span className="text-sm text-zinc-500" aria-hidden="true">
								{timeRange}
							</span>
						</div>
					)}
					{durationString && (
						<div
							className="flex flex-row items-center gap-1"
							aria-label={`${labels.duration[locale] ?? labels.duration.en}: ${durationString}`}
						>
							<IoTimerOutline size={16} aria-hidden="true" />
							<span className="text-sm text-zinc-500" aria-hidden="true">
								{durationString}
							</span>
						</div>
					)}
				</div>
				<span
					className="text-zinc-400 group-open:rotate-180 transition-transform"
					aria-hidden="true"
				>
					▼
				</span>
			</summary>
			{hasDetails && (
				<div className="px-4 pb-4 pl-24 flex flex-col gap-2">
					{event.location && (
						<div
							className="flex flex-row items-center gap-1"
							aria-label={`${labels.location[locale] ?? labels.location.en}: ${event.location}`}
						>
							<IoLocationOutline size={18} aria-hidden="true" />
							<span className="text-sm" aria-hidden="true">
								{event.location}
							</span>
						</div>
					)}
					{event.description && <p className="text-sm">{event.description}</p>}
				</div>
			)}
		</details>
	);
}
