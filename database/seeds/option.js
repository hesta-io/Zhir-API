exports.seed = (knex) =>
	knex('option')
		.del()
		.then(() =>
			knex('option').insert([
				{
					key: 'price_per_page',
					value: 150,
				},
			])
		);
