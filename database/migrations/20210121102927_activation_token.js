const defualts = require('../extra/defualtColumns');

exports.up = (knex) =>
	knex.schema.createTable('activation_token', (table) => {
		table.increments('id').primary();
		table.integer('user_id');
		table.string('token', 350).notNullable().defaultTo('');

		defualts(table, ['active', 'updated_at']);
		table.charset('utf8mb4');
	});

exports.down = (knex) => knex.schema.dropTable('activation_token');
