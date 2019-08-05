'use strict';

const webpack = require('webpack');
const webpackConfig = require('../utils/webpackConfig');

module.exports = (packageFile, cwd, callback) => {
    const scssConfig = webpackConfig(packageFile, cwd, 'scss');
    if (typeof scssConfig === Error) {
        return;
    }
    webpack(scssConfig, (err, stats) => {
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
