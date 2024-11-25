exports.tambah = (event = {}) => {
    try {
        const payload = event.body || {};
        if (payload?.val1 && payload?.val2) {
            payload.val1 = +payload.val1;
            payload.val2 = +payload.val2;
            payload.result = payload.val1 + payload.val2;
        }
        return { data: payload };
    } catch (err) {
        throw err;
    }
};

exports.kurang = (event = {}) => {
    try {
        const payload = event.params;
        if (payload?.val1 && payload?.val2) {
            payload.val1 = +payload.val1;
            payload.val2 = +payload.val2;
            payload.result = payload.val1 - payload.val2;
        }
        return { data: payload };
    } catch (err) {
        throw err;
    }
};

exports.kurang = (event = {}) => {
    try {
        const payload = event.params;
        if (payload?.val1 && payload?.val2) {
            payload.val1 = +payload.val1;
            payload.val2 = +payload.val2;
            payload.result = payload.val1 - payload.val2;
        }
        return { data: payload };
    } catch (err) {
        throw err;
    }
};

exports.kali = (event = {}) => {
    try {
        const payload = event.params;
        if (payload?.val1 && payload?.val2) {
            payload.val1 = +payload.val1;
            payload.val2 = +payload.val2;
            payload.result = payload.val1 * payload.val2;
        }
        return { data: payload };
    } catch (err) {
        throw err;
    }
};