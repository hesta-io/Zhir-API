const defualts = require('../extra/defualtColumns');

exports.up = (knex) =>
	knex.schema.createTable('page', (table) => {
		table.string('id', 36).primary();
		table.string('name', 350).notNullable().defaultTo('');
		table.integer('user_id');
		table.string('job_id', 350);
		table
			.datetime('started_processing_at', { precision: 6 })
			.defaultTo(knex.fn.now(6));

		table.boolean('processed').notNullable().defaultTo(0);
		table.boolean('is_free').notNullable().defaultTo(0);

		table
			.datetime('finished_processing_at', { precision: 6 })
			.defaultTo(knex.fn.now(6));
		table.boolean('succeeded').notNullable().defaultTo(1);

		table.text('result', 'MEDIUMTEXT');
		table.text('processed_result', 'MEDIUMTEXT');

		defualts(table, ['active', 'updated_at']);
		table.charset('utf8mb4');
	});

exports.down = (knex) => knex.schema.dropTable('page');
