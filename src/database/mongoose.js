const mongoose = require('mongoose');
require("dotenv").config();

module.exports = {
    init: () => {
		const dbOptions = {
			useNewUrlParser: true,
			autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4,
			useUnifiedTopology: true,
		};
		mongoose.connect(process.env.MONGO_URI, dbOptions);
		mongoose.Promise = global.Promise;
		mongoose.connection.on('connected', () => {
            console.log("MongoDB conectado com sucesso.")
		});
		mongoose.connection.on('err', (err) => {
            console.error(`Ocorreu um erro no MongoDB: \n ${err.stack}`)
		});
		mongoose.connection.on('disconnected', () => {
            console.log("MongoDB desconectado.")
		});
	},
	async ping() {
		const currentNano = process.hrtime();
		await mongoose.connection.db.command({ ping: 1 });
		const time = process.hrtime(currentNano);
		return (time[0] * 1e9 + time[1]) * 1e-6;
	}
}