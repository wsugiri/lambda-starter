const validate = (event, schema) => {
    if (schema) {
        const keys = Object.keys(schema);
        for (let i = 0; i < keys.length; i += 1) {
            const key = keys[i];
            const { value, error } = schema[key].validate(event[key]);
            event[key] = value;

            if (error) {
                const message = 'JOI_VALIDATOR_ERROR';
                return { statusCode: 422, message, body: { message, data: error.details[0] } };
            }
        }
    }

    return null;
};

exports.load = (name, action, schema) => {
    const appHandler = require(`../handlers/${name}`);

    return async (req, res) => {
        const error = validate(req, schema);
        if (error) {
            res.status(error.statusCode).send(error.body);
            return;
        }

        try {
            const resp = await appHandler[action](req);
            const statusCode = resp.statusCode || 200;
            if (resp.statusCode) delete resp.statusCode;
            res.status(statusCode).send(resp.body ? resp.body : resp);
            return;
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    }
};

