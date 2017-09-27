import { onLoad } from './scripts/app.js'
import { $on } from './scripts/helpers.js'

import add from '../node_modules/lodash-es/add.js';

import leftpad from './support-cjs.js';

$on(window, 'load', onLoad);
$on(window, 'hashchange', onLoad);

console.log(add(6, 4));

console.log(leftpad('foo', 5));
