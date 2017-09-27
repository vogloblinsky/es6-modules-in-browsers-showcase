import ignore from 'rollup-plugin-ignore';

export default {
    input: 'src/main.js',
    output: {
        file: 'src/main-bundled.js',
        format: 'es'
    },
    sourceMap: false,
    plugins: [
        ignore(['babel-polyfill'])
    ]
};
