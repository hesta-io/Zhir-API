exports.up = (knex) =>
	knex.schema.alterTable('job', (table) => {
		table.integer('rate', 11).defaultTo(-1000);
	});

exports.down = (knex) =>
	knex.schema.alterTable('job', (table) => {
		table.dropColumn('rate');
	});
