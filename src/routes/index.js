exports.instance = (app) => {
    app.get('/health/env', (req, res) => { res.send(process.env); });

    app.use(`/api/aws`, require('./aws'));
    app.use(`/api/math`, require('./math'));

    app.use('/', require('./views'));
};

