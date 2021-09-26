exports.seed = (knex) =>
	knex('payment_medium')
		.del()
		.then(() =>
			knex('payment_medium').insert([
				{
					id: 1,
					name: 'ژیر',
					code: 'ZHIR',
					min_amount: 1000, // 1000IQD
					max_amount: 350000, // 350000 IQD
					currency_symbol: '',
				},
				{
					id: 2,
					name: 'فاستپەی',
					code: 'FASTPAY',
					min_amount: 1000, // 1000IQD
					max_amount: 350000, // 350000 IQD
					currency_symbol: 'د.ع',
				},
				{
					id: 3,
					name: 'ئاسیا حەواڵە',
					code: 'ASIA_HAWALA',
					min_amount: 1000, // 1000IQD
					max_amount: 350000, // 350000 IQD
					currency_symbol: 'د.ع',
				},
				{
					id: 4,
					name: 'زەین کاش',
					code: 'ZAIN_CASH',
					min_amount: 1000, // 1000IQD
					max_amount: 350000, // 350000 IQD
					currency_symbol: 'د.ع',
				},
				{
					id: 5,
					name: 'باڵانس',
					code: 'BALANCE',
					min_amount: 0, // 1000IQD
					max_amount: 350000, // 350000 IQD
					currency_symbol: 'د.ع',
				},
				{
					id: 6,
					name: 'ئایدی پەی',
					code: 'IDPAY',
					min_amount: 0,
					max_amount: 3500000,
					currency_symbol: 'ریال',
				},
			])
		);
