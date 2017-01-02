const config = require('./../../config/config');

const fs = require('fs');
const path = require('path');

class SiteController {
    constructor () {}

    static main (req, res, next) {
        fs.createReadStream (
            path.join(config.staticDir, 'index.html')
        ).pipe(res);
    }
}

module.exports = SiteController;