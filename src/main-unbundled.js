import { onLoad } from './scripts/app.js'
import { $on } from './scripts/helpers.js'

import add from '../node_modules/lodash-es/add.js';

$on(window, 'load', onLoad);
$on(window, 'hashchange', onLoad);

console.log(add(6, 4));
