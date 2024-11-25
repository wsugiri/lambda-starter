const fs = require('fs');
const path = require('path');

exports.landing = async (event) => {
    const htmlPath = path.join(__dirname, '../../views/index.html');
    const template = await fs.readFileSync(htmlPath, 'utf-8');

    let html = template.replace('[hash]', process.env.HASH);

    switch (event.originalUrl) {
        default:
            html = html.replace('[title]', 'Sooka Chemical');
            html = html.replace('[og_title]', 'Sooka Chemical');
            html = html.replace('[og_description]', 'Sooka Chemical by warsootech');
            break;
    }

    return html;
};
