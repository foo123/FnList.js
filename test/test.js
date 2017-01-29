"use strict";
var F = require('../FnList.js'), echo = console.log;

for(var i=0; i<20; i++)
{
    var a = F.shuffle(F.array(10, 0, 1));
    echo('shuffled '+a.join(','));
    //echo(F.is_sorted(a));
    var s1 = F.select(a, 1, 1);
    echo('select 1 = '+s1+' = '+a[s1]+(1!==a[s1]?' ERROR':''));
    echo('sorted '+F.sort(a).join(','));
    //echo(F.is_sorted(a));
    var s2 = F.select(a, 1, 1);
    echo('select 1 = '+s2+' = '+a[s2]+(1!==a[s2]?' ERROR':''));
}