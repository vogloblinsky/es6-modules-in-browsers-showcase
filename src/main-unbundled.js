import {onLoad} from './scripts/app.js'
import {$on} from './scripts/helpers.js'

$on(window, 'load', onLoad);
$on(window, 'hashchange', onLoad);
