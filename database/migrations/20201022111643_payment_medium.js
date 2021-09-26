const defualts = require('../extra/defualtColumns');

exports.up = (knex) =>
	knex.schema.createTable('payment_medium', (table) => {
		table.increments('id').primary();
		table.string('name', 350).notNullable().defaultTo('');
		table.string('code', 350).notNullable().defaultTo('');
		table.decimal('min_amount', 11, 3).notNullable().defaultTo(0); // minimum amout to use for a transaction
		table.decimal('max_amount', 11, 3).notNullable().defaultTo(0); // maximum amout to use for a transaction
		defualts(table);
		table.charset('utf8mb4');
	});

exports.down = (knex) => knex.schema.dropTable('payment_medium');
