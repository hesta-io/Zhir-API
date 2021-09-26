exports.seed = (knex) =>
	knex('transaction_type')
		.del()
		.then(() =>
			knex('transaction_type').insert([
				{
					id: 1,
					name: 'پرکرنەوەی باڵانس',
					code: 'RECHARGE',
				},
				{
					id: 2,
					name: 'سکانکردن',
					code: 'OCR-JOB',
				},
				{
					id: 3,
					name: 'ناردنی باڵانس',
					code: 'BALANCE-TRANSFER',
				},
			])
		);
