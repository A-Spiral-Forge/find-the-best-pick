exports.getMissingRequiredParams = (refParams = [], paramsToCheck = {}) => {
	let missingParams = [];
	let ptoCheck = Object.keys(paramsToCheck);
	let prop;
	for (prop of refParams) {
		if (!ptoCheck.includes(prop)) {
			missingParams.push(prop);
		}
	}
	return missingParams;
};

exports.sendResponse = (res, data, code = 200) => {
	let send_data = {};
	if (code >= 400 && code <= 451) {
		send_data.success = false;
		send_data.error = true;
	} else if (code >= 200 && code <= 226) {
		send_data.success = true;
		send_data.error = false;
	}
	if (typeof data === 'object') {
		send_data = Object.assign(send_data, data);
	}
	res.statusCode = code;
	return res.send(send_data);
};

/**
 * Filter the object so that only allowed fields are modified in database
 * @param {*} obj Object to be filtered
 * @param  {...String} allowedFields Fields allowed to be modified
 * @returns {*} Filtered object with allowed fields
 */
exports.filterObj = (obj, ...allowedFields) => {
	const filteredObj = {};
	Object.keys(obj).forEach((el) => {
		if (allowedFields.includes(el)) filteredObj[el] = obj[el];
	});
	return filteredObj;
};