//This is needed so pnpm links the needed webpack loaders in node_modules
module.exports = {
    hooks: {
        readPackage
    }
};

function readPackage(pkg, context) {
    if (pkg['one-fits-all']) {
        pkg.devDependencies = Object.assign({}, pkg.devDependencies, {
            tslint: '*',
            jsverify: '*',
            webpack: '*',
            mocha: '*',
            typescript: '*',
            'awesome-typescript-loader': '*',
            'style-loader': '*',
            'css-loader': '^1.0.1',
            'tslint-loader': '*',
            'sass-loader': '*',
            'postcss-loader': '*',
            'istanbul-instrumenter-loader-fix': '*',
            '@types/history': '*',
            '@types/node': '*',
            'source-map': '*',
            tapable: '*',
            '@types/tapable': '*',
            'uglify-js': '*',
            '@types/uglify-js': '*',
            'cross-env': '*',
            'mocha-webpack': '2.0.0-beta.0'
        });
        pkg.dependencies = Object.assign({}, pkg.dependencies, {
            snabbdom: '*',
            history: '*'
        });
    }

    return pkg;
}
