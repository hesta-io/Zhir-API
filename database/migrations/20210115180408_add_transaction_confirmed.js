exports.up = (knex) =>
	knex.schema.alterTable('user_transaction', (table) => {
		table.boolean('confirmed').defaultTo(0);
	});

exports.down = (knex) =>
	knex.schema.alterTable('user_transaction', (table) => {
		table.dropColumn('confirmed');
	});
