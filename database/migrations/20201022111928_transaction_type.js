exports.up = (knex) =>
	knex.schema.createTable('transaction_type', (table) => {
		table.increments('id').primary();
		table.string('name', 350).notNullable().defaultTo('');
		table.string('code', 350).notNullable().defaultTo('');
		table.charset('utf8mb4');
	});

exports.down = (knex) => knex.schema.dropTable('transaction_type');
