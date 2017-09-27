import node from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/support.js',
    output: {
        file: 'src/support-cjs.js',
        format: 'cjs'
    },
    sourceMap: false,
    plugins: [
        node({
          jsnext: true
        }),
        commonjs()
    ]
};
