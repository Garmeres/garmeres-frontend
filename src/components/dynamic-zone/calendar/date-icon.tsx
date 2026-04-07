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
	const month = parseInt(dateIso.slice(5, 7), 10) - 1;
	const day = parseInt(dateIso.slice(8, 10), 10);
	const months = monthNames[locale] ?? monthNames.en;
	const monthLabel = months[month];

	return (
		<div
			role="img"
			className="flex flex-col justify-center items-center border-l-2 border-fuchsia-400 mr-auto w-16 shrink-0"
			aria-label={`${day}. ${monthLabel}`}
		>
			<span aria-hidden="true">{day}</span>
			<span aria-hidden="true" className="text-sm">
				{monthLabel.slice(0, 3)}
			</span>
		</div>
	);
}
