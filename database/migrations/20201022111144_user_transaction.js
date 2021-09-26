const defualts = require('../extra/defualtColumns');

exports.up = (knex) =>
	knex.schema.createTable('user_transaction', (table) => {
		table.increments('id').primary();
		table.integer('user_id');
		table.integer('type_id');
		table.integer('payment_medium_id').defaultTo(0); // defualt payment medium we can add extra column to payment_mediums
		table.integer('page_count');
		table.decimal('amount', 11, 3).notNullable().defaultTo(1000); // we use IQD only
		table.string('transaction_id', 350);
		table.string('user_note', 350).defaultTo('');
		table.string('admin_note', 350).defaultTo('');

		defualts(table, ['active', 'deleted', 'updated_at']);
		table.charset('utf8mb4');
	});

exports.down = (knex) => knex.schema.dropTable('user_transaction');
