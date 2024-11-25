const { Sequelize } = require('sequelize');

const dbConnection = (cnString) => {
	const arr1 = cnString.split('://');
	const arr2 = arr1[1].split('/');
	const arr3 = arr2[0].split('@');
	const arr4 = arr3[0].split(':');

	const dialect = arr1[0];
	const name = arr2[1];
	const user = arr4[0];
	const password = arr4[1];
	const host = arr3[1];

	const sequelize = new Sequelize(name, user, password, { host, dialect });
	return sequelize;
};

exports.dbData = dbConnection(process.env.DB_DATA);
