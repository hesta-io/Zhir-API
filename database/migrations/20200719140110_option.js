exports.up = (knex) =>
	knex.schema.createTable('option', (table) => {
		table.increments('id').primary();
		table.string('key', 355).notNullable().defaultTo('');
		table.string('value', 355).notNullable().defaultTo('');
		table.charset('utf8mb4');
	});

exports.down = (knex) => knex.schema.dropTable('option');
