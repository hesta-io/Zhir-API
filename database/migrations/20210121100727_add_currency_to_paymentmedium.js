exports.up = (knex) =>
	knex.schema.alterTable('payment_medium', (table) => {
		table.string('currency_symbol', 100).defaultTo('');
	});

exports.down = (knex) =>
	knex.schema.alterTable('payment_medium', (table) => {
		table.dropColumn('currency_symbol');
	});
