const path = require('path');

module.exports = {
    entry: {
        Main: "./lib/js/src/Main.bs.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/"),
    },
    mode: 'production'
};
