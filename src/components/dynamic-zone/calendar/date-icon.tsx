const monthNames: Record<string, string[]> = {
	en: [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],
	no: [
		"Januar",
		"Februar",
		"Mars",
		"April",
		"Mai",
		"Juni",
		"Juli",
		"August",
		"September",
		"Oktober",
		"November",
		"Desember",
	],
	se: [
		"Ođđajagemánnu",
		"Guovvamánnu",
		"Njukčamánnu",
		"Cuoŋománnu",
		"Miessemánnu",
		"Geassemánnu",
		"Suoidnemánnu",
		"Borgemánnu",
		"Čakčamánnu",
		"Golggotmánnu",
		"Skábmamánnu",
		"Juovlamánnu",
	],
};

export function DateIcon({
	locale,
	dateIso,
}: {
	locale: string;
	dateIso: string;
}) {
	const date = new Date(dateIso);
	const months = monthNames[locale] ?? monthNames.en;
	const monthLabel = months[date.getMonth()];

	return (
		<div
			role="img"
			className="flex flex-col justify-center items-center border-l-2 border-fuchsia-400 mr-auto w-16 shrink-0"
			aria-label={`${date.getDate()}. ${monthLabel}`}
		>
			<span aria-hidden="true">{date.getDate()}</span>
			<span aria-hidden="true" className="text-sm">
				{monthLabel.slice(0, 3)}
			</span>
		</div>
	);
}
