const defualts = require('../extra/defualtColumns');

exports.up = (knex) => knex.schema.createTable('user', (table) => {
	table.increments('id').primary();
	table.string('name', 350).notNullable().defaultTo('');
	table.string('company_name', 350).notNullable().defaultTo('');
	table.string('email', 350).notNullable().unique();
	table.string('password', 100).notNullable().defaultTo('');
	table.string('tmp_password', 100).defaultTo('');
	table.string('activation_token', 100).defaultTo('');
	table.string('salt', 100).notNullable().defaultTo('');
	table
		.enu('gender', ['male', 'female', 'unspecified'])
		.notNullable()
		.defaultTo('unspecified');
	table.boolean('is_admin').defaultTo(0);
	table.boolean('verified').defaultTo(0);
	table.date('birthdate');
	table.string('phone_no', 100).notNullable().defaultTo('');
	table.string('uid', 200).notNullable().defaultTo('');
	defualts(table);
	table.charset('utf8mb4');
});

exports.down = (knex) => knex.schema.dropTable('user');
