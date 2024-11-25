require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const route = require('./src/routes');

(async () => {
    app.use(express.json());
    app.use(cors({ origin: true }));

    route.instance(app);

    const port = process.env.APP_PORT || 9001;

    app.listen(port, () => {
        console.log(`Listening on ${port}`);
    });
})();