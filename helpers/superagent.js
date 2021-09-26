const superagent = require('superagent');

function constructHtmlError(err) {
	const { response } = err;
	if (response) {
		const { status, body } = response;
		let lis = '';
		if (status === 422) {
			const { errors } = body;
			(errors || []).forEach((e) => {
				lis += `<li> ${e.param} : ${e.msg} </li>`;
			});
		} else if (status === 400 || status === 401 || status === 429) {
			lis += `<li> ${body.msg}</li>`;
		} else if (status === 500) {
			lis += `<li> ${body.msg}</li>`;
		} else {
			lis += '<li> ببورە هەڵەیەک لە راژە رویدا </li>';
		}
		const html = `
			<ul >
				${lis}
			</ul>
		`;
		return html;
	}
	return '';
}
const agent = superagent.agent();
agent.on('error', (err) => {
	// eslint-disable-next-line no-param-reassign
	err.htmlError = constructHtmlError(err);
	return err;
});
export default agent;
