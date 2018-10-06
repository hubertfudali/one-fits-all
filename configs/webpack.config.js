const {
    createConfig,
    match,
    env,
    defineConstants,
    entryPoint,
    setOutput,
    sourceMaps,
    addPlugins,
    customConfig,
    resolve,
    setMode
} = require('@webpack-blocks/webpack');
const { css, file, url } = require('@webpack-blocks/assets');
const devServer = require('@webpack-blocks/dev-server');
const extractText = require('@webpack-blocks/extract-text');
const postcss = require('@webpack-blocks/postcss');
const sass = require('@webpack-blocks/sass');
const uglify = require('@webpack-blocks/uglify');
const typescript = require('@webpack-blocks/typescript');
const tslint = require('@webpack-blocks/tslint');

const webpackMerge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');
const fs = require('fs');

const appPath = (...names) => path.join(process.cwd(), ...names);
const userConfig = require(appPath('webpack.config.js'));

module.exports = webpackMerge(
    createConfig([
        setMode(process.env.NODE_ENV || 'development'),
        typescript({
            useCache: true,
            cacheDirectory: 'node_modules/.cache/at-loader'
        }),
        tslint(),
        resolve({ extensions: ['.js', '.jsx'] }),
        match(
            ['*.scss', '*.sass'],
            [
                sass({
                    includePaths: [appPath('node_modules')],
                    sourceMap: true
                }),
                postcss({
                    plugins: [autoprefixer({ browsers: ['last 2 versions'] })]
                }),

                env('production', [extractText('[name].[hash].css')])
            ]
        ),
        match(['*.eot', '*.ttf', '*.woff', '*.woff2'], [file()]),
        match(
            ['*.gif', '*.jpg', '*.jpeg', '*.png', '*.svg', '*.webp'],
            [url({ limit: 10000 })]
        ),
        defineConstants({
            'process.env.NODE_ENV': process.env.NODE_ENV
        }),
        addPlugins([
            new HtmlWebpackPlugin({
                template: './index.ejs',
                alwaysWriteToDisk: true,
                inject: true,
                favicon: 'public/favicon.png',
                hash: true
            }),
            new HtmlWebpackHarddiskPlugin({
                outputPath: appPath('public')
            }),
            new webpack.ProvidePlugin({
                Snabbdom: 'snabbdom-pragma'
            })
        ]),
        env('development', [
            devServer({
                contentBase: appPath('public')
            }),
            sourceMaps(),
            addPlugins([new webpack.NamedModulesPlugin()])
        ]),
        env('production', [
            uglify({
                parallel: true,
                cache: true,
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                }
            }),
            addPlugins([
                new CleanWebpackPlugin([appPath('build')], {
                    root: process.cwd()
                }),
                new CopyWebpackPlugin([{ from: 'public', to: '' }])
            ])
        ])
    ]),
    userConfig
);
