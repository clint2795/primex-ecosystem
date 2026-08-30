#!/usr/bin/env node
'use strict';
const fs=require('fs');
const assert=require('assert');
const html=fs.readFileSync('finance-operator-v2-mobile-proof/index.html','utf8');
assert(html.includes('stagebar'),'stagebar missing');
assert(html.includes('.stagebar{display:flex'),'stagebar layout missing');
assert(html.includes('.stage:not(:last-child)::after'),'connector missing');
assert(html.includes('.stage.done:not(:last-child)::after'),'completed connector state missing');
assert(html.includes('.stage.current:not(:last-child)::after'),'current connector state missing');
console.log('V2 connected progress regression: PASS');
