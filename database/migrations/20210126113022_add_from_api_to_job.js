exports.up = (knex) =>
	knex.schema.alterTable('job', (table) => {
		table.boolean('from_api').defaultTo(0);
	});

exports.down = (knex) =>
	knex.schema.alterTable('job', (table) => {
		table.dropColumn('from_api');
	});
