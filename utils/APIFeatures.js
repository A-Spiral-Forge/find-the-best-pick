/**
 * 
 * @param {*} props Features to filter the response
 * @returns Response after filtering by fetures
 */
module.exports = (props) => {
	const sort = props.sort
		? `ORDER BY ${props.sort.split('%20').join(' ')} `
		: '';

	const limit = props.limit ? `LIMIT ${props.limit} ` : '';

	return `${sort}${limit}`;
};
