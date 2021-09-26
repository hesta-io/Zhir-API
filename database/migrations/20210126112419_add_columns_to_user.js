exports.up = (knex) =>
	knex.schema.alterTable('user', (table) => {
		table.boolean('can_use_api').defaultTo(0);
		table.string('api_key', 200).defaultTo('');
		table.integer('monthly_recharge', 11).defaultTo(50);
	});

exports.down = (knex) =>
	knex.schema.alterTable('user', (table) => {
		table.dropColumn('can_use_api');
		table.dropColumn('api_key');
		table.dropColumn('monthly_recharge');
	});
