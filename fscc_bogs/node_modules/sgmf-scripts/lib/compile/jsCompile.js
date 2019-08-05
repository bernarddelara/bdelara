'use strict';
const webpack = require('webpack');
const webpackConfig = require('../utils/webpackConfig');

module.exports = (packageFile, cwd, callback) => {
    const jsConfig = webpackConfig(packageFile, cwd, 'js');
    if (typeof jsConfig === Error) {
        return;
    }
    webpack(jsConfig, (err, stats) => {
        if (err) {
            console.error(err);
            callback(1);
            return;
        }
        console.log(stats.toString({
            chunks: false,
            colors: true
        }));
        callback(0);
    });
};
