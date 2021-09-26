module.exports = (rawNumber) => {
	const number = `${rawNumber}`;
	let charIndex = 0;
	let NumericArabic = '';

	while (charIndex < number.length) {
		switch (number[charIndex]) {
			case '.':
				NumericArabic += '.';
				break;

			case '0':
				NumericArabic += '٠';
				break;

			case '1':
				NumericArabic += '١';
				break;

			case '2':
				NumericArabic += '٢';
				break;

			case '3':
				NumericArabic += '٣';
				break;

			case '4':
				NumericArabic += '٤';
				break;

			case '5':
				NumericArabic += '٥';
				break;

			case '6':
				NumericArabic += '٦';
				break;

			case '7':
				NumericArabic += '٧';
				break;

			case '8':
				NumericArabic += '٨';
				break;

			case '9':
				NumericArabic += '٩';
				break;

			default:
				NumericArabic += number[charIndex];
				break;
		}

		charIndex += 1;
	}

	return NumericArabic;
};
