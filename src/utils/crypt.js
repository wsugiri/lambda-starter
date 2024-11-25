const CryptoJS = require('crypto-js');
const dayjs = require('dayjs');
const key = process.env.TOKEN_SECRET || 'justmansecret';

exports.hash = (text) => CryptoJS.MD5(`${text}${key}`).toString();
exports.encode = (text) => CryptoJS.AES.encrypt(text, key).toString();
exports.decode = (cryptText) => CryptoJS.AES.decrypt(cryptText, key).toString(CryptoJS.enc.Utf8);
exports.signing = (data) => {
    const lifetime = process.env.TOKEN_ACCESS_LIFETIME_IN_MINUTES || 30;
    const created = dayjs();
    const expired = created.add(lifetime, 'minutes');
    const payload = {
        created_at: created.unix(),
        expired_at: expired.unix(),
        data,
    };
    return exports.encode(JSON.stringify(payload));
};