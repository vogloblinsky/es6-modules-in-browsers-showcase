const webpack = require('webpack'),
    path = require('path'),
    UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const assetCachingPlugins = ({
    defines,
    runtimeName
}) => {
    return [new UglifyJSPlugin({
        sourceMap: true,
        uglifyOptions: {
            mangle: {
                // Solves this Safari 10 issue:
                // https://github.com/mishoo/UglifyJS2/issues/1753
                safari10: true,
            },
        },
    })];
};

const generateBabelEnvLoader = (browserlist) => {
    return {
        test: /\.js$/,
        use: {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                presets: [
                    ['env', {
                        debug: true,
                        modules: false,
                        useBuiltIns: true,
                        targets: {
                            browsers: browserlist,
                        },
                    }],
                ],
                plugins: ['syntax-dynamic-import'],
            },
        },
    };
};

const getLegacyConfig = () => ({
    entry: {
        'main-legacy': './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, './src'),
        publicPath: '/',
        filename: 'main-legacy.js',
    },
    module: {
        rules: [
            generateBabelEnvLoader([
                'last 2 versions',
            ]),
        ],
    },
});

const getLegacyMinConfig = () => ({
    entry: {
        'main-legacy': './src/main.js',
    },
    output: {
        path: path.resolve(__dirname, './src'),
        publicPath: '/',
        filename: 'main-legacy.min.js',
    },
    plugins: assetCachingPlugins({
      runtimeName: 'runtime-legacy',
    }),
    module: {
        rules: [
            generateBabelEnvLoader([
                'last 2 versions',
            ]),
        ],
    },
});

const createCompiler = (config) => {
    const compiler = webpack(config);
    return () => {
        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err) return reject(err);
                console.log(stats.toString({
                    colors: true
                }) + '\n');
                resolve();
            });
        });
    };
};


const javascript = async() => {
    const compileLegacyBundle = createCompiler(getLegacyConfig());
    await compileLegacyBundle();

    const compileLegacyMinBundle = createCompiler(getLegacyMinConfig());
    await compileLegacyMinBundle();
}

(async() => {
    try {
        await javascript();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
