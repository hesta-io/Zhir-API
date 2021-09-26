exports.up = (knex) =>
	knex.schema.createTable('test', (table) => {
		table.increments('id').primary();
		table.string('name', 350).notNullable().defaultTo('default name');
		table.charset('utf8mb4');
		// table.collate('utf8_general_ci');
	});

exports.down = (knex) => knex.schema.dropTable('test');
