module.exports = (table, excludes = []) => {
	if (excludes.indexOf('active') < 0) {
		table.boolean('active').notNullable().defaultTo(1);
	}
	if (excludes.indexOf('deleted') < 0) {
		table.boolean('deleted').notNullable().defaultTo(0);
	}
	if (excludes.indexOf('updated_at') < 0) {
		table.datetime('updated_at', { precision: 6 });
		table.integer('updated_by').notNullable().defaultTo(0);
	}

	table.datetime('created_at', { precision: 6 });
	table.integer('created_by').notNullable().defaultTo(0);
	table.charset('utf8mb4');
	return table;
};
