export function wrap(
	content: string,
	tag: string = "",
	attributes: string = "", // must include the key "attribute='value'"
	cssclass: string = ""
) {
	if (tag == "") {
		return "";
	}

	if (content == "") {
		return "";
	}

	/* ━━━━━━━━━━━━━━━━━━━━━━━ End of Parameter Checking ━━━━━━━━━━━━━━━━━━━━━━━ */

	let cssclass_prep;
	if (cssclass != "") {
		cssclass_prep = ` class="${cssclass}" `;
	}

	let attributes_prep;
	if (attributes != "") {
		attributes_prep = ` class="${attributes}" `;
	}

	return `<${tag}${cssclass_prep || cssclass}${
		attributes_prep || attributes
	}>${content}</${tag}>`;
}

export function uuid(): string {
	const rand = Math.random().toString().substr(2, 8);
	return rand;
}
