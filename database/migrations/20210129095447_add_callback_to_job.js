exports.up = (knex) =>
	knex.schema.alterTable('job', (table) => {
		table.string('callback', 1000).defaultTo('');
	});

exports.down = (knex) =>
	knex.schema.alterTable('job', (table) => {
		table.dropColumn('callback');
	});
