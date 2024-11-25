const { config } = require('dotenv');

(async () => {
    config();

    const testMethod = process.argv[2];
    if (!testMethod) {
        console.log('no test parameter', '\n');
        return;
    }

    const dateStart = Date.now();
    let resp;

    switch (testMethod) {
        case 'tambah':
            resp = await require('../src/handlers/math').tambah(require('./mocks/tambah.json'));
            break;
        case 'kurang':
            resp = await require('../src/handlers/math').kurang(require('./mocks/kurang.json'));
            break;
        case 'kali':
            resp = await require('../src/handlers/math').kali(require('./mocks/kali.json'));
            break;
        default:
            break;
    }

    const duration = Date.now() - dateStart;

    if (resp) console.log(resp);
    console.log('-- duration --', duration);
})();
