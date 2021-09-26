const debug = require('debug');

const app = require('../app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
	debug.log(`app listening at http://localhost:${port}`);
});
