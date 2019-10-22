// Creates a string representation of a binary number of a specified bit size
function binaryStringOf(num, bits = 32) {
	if (num === "") {
		throw new TypeError("The arguments can not be empty.");
	}

	if (Number.isNaN(Number(num))) {
		throw new TypeError(`The argument "${num}" is not a number.`);
	} else {
		num = Number(num);
	}

	if (!Number.isInteger(num)) {
		throw new TypeError(`The argument "${num}" is not an integer.`);
	}

	// Integer range is 2^bits minus one for the signed bit
	const rangeMax = 2 ** (bits - 1) - 1;
	const rangeMin = -(2 ** (bits - 1));

	if (num > rangeMax || num < rangeMin) {
		throw new RangeError(
			`The integer "${num}" can not be contained in ${bits - 1}\
			bits (${bits} bits total with 1 signed bit).`
		);
	}

	if (num >= 0) {
		const binaryString = num.toString(2);
		// Binary toString drops leading zeros, add up to the dersired bit size back
		const binaryFixedSizeString = binaryString.padStart(bits, "0");

		return binaryFixedSizeString;
	} else {
		// A fake zero fill right shift makes the number unsigned
		const unsignedNum = num >>> 0;
		// The unsigned number forces JS to convert the binary to a string as two's compliment
		const binaryString = unsignedNum.toString(2);
		// Unsigned numbers are 32 bit so we drop leading bits to get the desired bit size
		const binaryFixedSizeString = binaryString.substring(32 - bits);

		return binaryFixedSizeString;
	}
}

// Adds the HTML needed for the Booth's algorithm table headers
function addTableHeaders() {
	const tableElement = document.querySelector("thead");
	tableElement.innerHTML = `<tr>\
	<th>Iteration</th>\
	<th>Step</th>\
	<th>Multiplicand</th>\
	<th>Product</th>\
	</tr>`;
}

// Adds an HTML row to the Booth's algorithm table
function addRowToTable(
	iterationNumber,
	stepName,
	multiplicand,
	product,
	bitSize
) {
	const productLastTwoBits = product.slice(-2, product.length);
	product = product.slice(0, -2);

	// Go to bitSize - 1 to account for the bit which is part of productLastTwoBits
	const productRightBits = product.slice(-(bitSize - 1), product.length);
	product = product.slice(0, -(bitSize - 1));

	const productLeftBits = product.slice(-bitSize, product.length);

	let productString = `${productLeftBits}&nbsp;${productRightBits}${productLastTwoBits}`;

	// Only highlight the last two bits when they cause the next step to be an ADD or SUB
	if (
		(productLastTwoBits === "10" || productLastTwoBits === "01") &&
		(stepName === "ASR" || stepName === "INIT") &&
		iterationNumber !== bitSize
	) {
		productString = `${productLeftBits}&nbsp;${productRightBits}<mark>${productLastTwoBits}</mark>`;
	}

	if (stepName === "ADD") {
		stepName = '<font color="green">ADD</font>';
	}
	if (stepName === "SUB") {
		stepName = '<font color="red">SUB</font>';
	}

	const tableElement = document.querySelector("tbody");
	tableElement.innerHTML += `<tr>\
	<td>${iterationNumber}</td>\
	<td>${stepName}</td>\
	<td>${multiplicand}</td>\
	<td>${productString}</td>\
	</tr>`;
}

// Empties the HTML table used for the Booth's algorithm visualization
function clearTable() {
	document.querySelector("thead").innerHTML = "";
	document.querySelector("tbody").innerHTML = "";
}

// Returns the appropriate starting value for the product in Booth's algorithm
function boothsAlgorithmInitialProduct(multiplicand, multiplier, bitSize) {
	let product = multiplier;

	// The initial product should have all zeros in its left half,
	// even with a negative multiplier
	if (multiplier < 0) {
		let xorValue = 2 ** bitSize - 1;
		xorValue = ~xorValue;
		product = product ^ xorValue;
	}

	// Add an extra zero on the right end
	product <<= 1;
	return product;
}

// Adds the multiplicand to the left half of the product
function boothsAlgorithmAdd(multiplicand, product, bitSize) {
	multiplicand <<= bitSize + 1;
	product += multiplicand;

	return product;
}

// Subtracts the multiplicand from the left half of the product
function boothsAlgorithmSubtract(multiplicand, product, bitSize) {
	multiplicand <<= bitSize + 1;
	product -= multiplicand;

	return product;
}

//
function createBoothsAlgorithmTable(multiplicand, multiplier, bitSize) {
	// Table Headers

	addTableHeaders();

	// Row 0 (initialization row)

	let product = boothsAlgorithmInitialProduct(
		multiplicand,
		multiplier,
		bitSize
	);
	const multiplicandString = binaryStringOf(multiplicand, bitSize);
	addRowToTable(
		0,
		"INIT",
		multiplicandString,
		binaryStringOf(product),
		bitSize
	);

	// Rows for iterations 1 to bitSize

	for (let i = 1; i <= bitSize; i++) {
		let iteration = i;
		const productLastTwoBits = binaryStringOf(product).slice(-2);

		// We add or subtract the multiplicand from the left half of the
		// product depending on the values of its last two bits
		if (productLastTwoBits === "10") {
			product = boothsAlgorithmSubtract(multiplicand, product, bitSize);
			addRowToTable(
				iteration,
				"SUB",
				multiplicandString,
				binaryStringOf(product),
				bitSize
			);
			iteration = "";
		} else if (productLastTwoBits === "01") {
			product = boothsAlgorithmAdd(multiplicand, product, bitSize);
			addRowToTable(
				iteration,
				"ADD",
				multiplicandString,
				binaryStringOf(product),
				bitSize
			);
			iteration = "";
		}

		// We always do an arithmatic shift right (ASR) by 1
		product >>= 1;
		addRowToTable(
			iteration,
			"ASR",
			multiplicandString,
			binaryStringOf(product),
			bitSize
		);
	}

	// Final (result) row

	// Drop the last bit to get the real product result
	product >>= 1;
	const productBitSize = bitSize * 2;
	const productString = binaryStringOf(product, productBitSize);
	document.querySelector("tbody").innerHTML += `\
	<tr><td colspan="4" style="text-align:right;"><b>RESULT: ${productString}</b></td></tr>`;
}

// Validates input and creates the Booth's algoritm table
function onClickCreateTable() {
	// Grab form data
	let multiplicand = document.getElementById("multiplicand").value;
	let multiplier = document.getElementById("multiplier").value;
	const bitSize = parseInt(document.querySelector("select").value);

	try {
		// Show the equation in binary
		const multiplicandBinaryString = binaryStringOf(multiplicand, bitSize);
		const multiplierBinaryString = binaryStringOf(multiplier, bitSize);
		const resultBinaryString = binaryStringOf(
			multiplicand * multiplier,
			bitSize * 2
		);
		document.getElementById(
			"binary-preview"
		).innerHTML = `<hr>Binary: ${multiplicandBinaryString} x ${multiplierBinaryString} = ${resultBinaryString}`;

		clearTable();

		multiplicand = parseInt(multiplicand);
		multiplier = parseInt(multiplier);

		// Show the decimal product
		document.getElementById("decimal-output").textContent =
			multiplicand * multiplier;

		// Clear out any previous error warning if there was one
		const warningMsgElmement = document.getElementById("warning-message");
		if (warningMsgElmement != null) {
			document.getElementById("warning-message").innerText = "";
		}

		createBoothsAlgorithmTable(multiplicand, multiplier, bitSize);
	} catch (error) {
		document.getElementById("warning-message").innerHTML = error.message;
	}
}

document.getElementById("create-table-button").onclick = onClickCreateTable;
