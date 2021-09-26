const defualts = require('../extra/defualtColumns');

exports.up = (knex) =>
	knex.schema.createTable('job', (table) => {
		table.string('id', 36).primary();
		table.string('name', 350).notNullable().defaultTo('');
		table.string('code', 350).notNullable().defaultTo('');
		table.integer('user_id');
		table.integer('page_count');
		table.integer('paid_page_count');
		table.string('user_failing_reason', 350).notNullable().defaultTo('');
		table.enu('status', [
			'pending',
			'queued',
			'processing',
			'completed',
			'failed',
		]);
		table.string('lang', 350).defaultTo('ckb');

		table.datetime('queued_at', { precision: 6 }).defaultTo(knex.fn.now(6));
		table.datetime('processed_at', { precision: 6 });

		table.datetime('finished_at', { precision: 6 });
		// table.datetime('failed_at', { precision: 6 });
		table.string('failing_reason', 450).notNullable().defaultTo('');

		defualts(table, ['active', 'updated_at']);
		table.charset('utf8mb4');
	});

exports.down = (knex) => knex.schema.dropTable('job');
