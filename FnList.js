/**
*
*   FnList
*   Efficient (functional) methods for processing lists/sets/vectors/strings or arbitrary range of numbers
*   @version: 1.0.0
*   https://github.com/foo123/FnList.js
**/
!function( root, name, factory ){
"use strict";
if ( ('undefined'!==typeof Components)&&('object'===typeof Components.classes)&&('object'===typeof Components.classesByID)&&Components.utils&&('function'===typeof Components.utils['import']) ) /* XPCOM */
    (root.$deps = root.$deps||{}) && (root.EXPORTED_SYMBOLS = [name]) && (root[name] = root.$deps[name] = factory.call(root));
else if ( ('object'===typeof module)&&module.exports ) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if ( ('undefined'!==typeof System)&&('function'===typeof System.register)&&('function'===typeof System['import']) ) /* ES6 module */
    System.register(name,[],function($__export){$__export(name, factory.call(root));});
else if ( ('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/ ) /* AMD */
    define(name,['module'],function(module){factory.moduleUri = module.uri; return factory.call(root);});
else if ( !(name in root) ) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1)&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}(  /* current root */          this, 
    /* module name */           "FnList",
    /* module factory */        function ModuleFactory__FnList( undef ){
"use strict";

var stdMath = Math, HAS = Object[PROTO].hasOwnProperty, toString = Object[PROTO].toString,
    FnList;

// utility methods
function is_array( x ) { return (x instanceof Array) || ('[object Array]' === toString.call(x)); }
function is_string( x ) { return (x instanceof String) || ('[object String]' === toString.call(x)); }
function rndInt( m, M ) { return stdMath.round( (M-m)*stdMath.random( ) + m ); }
function addn( s, a ) { return s+a; }
function muln( p, a ) { return p*a; }

function Node( k, v, p, n, l, r, d )
{
    // a unified graph as well as (binary) tree, as well as quadraply-, doubly- and singly- linked list
    var self = this;
    self.key = k; self.val = v;
    self.prev = p || null; self.next = n || null;
    self.left = l || null; self.right = r || null;
    self.data = d || null;
}
Node.NODE = 1; Node.PREV = 2; Node.NEXT = 4; Node.LEFT = 8; Node.RIGHT = 16;
Node.walk = function walk( scheme, node, process ) {
    /*
    depth-first, tree, in-order, node.prev -> node -> node.right
    walk( PREV*FIRST | NODE*SECOND | RIGHT*THIRD, node, process);
    
    depth-first, tree, pre-order, node -> node.left -> node.right
    walk( NODE*FIRST | LEFT*SECOND | RIGHT*THIRD, node, process);
    
    depth-first, tree, post-order, node.left -> node.right -> node
    walk( LEFT*FIRST | RIGHT*SECOND | NODE*THIRD, node, process);
    
    depth-first, graph, in-order node.prev -> node.next -> node -> node.left -> node.right
    walk( PREV*FIRST | NEXT*SECOND | NODE*THIRD | LEFT*FOURTH | RIGHT*FIFTH, node, process);
    
    breadth-first, graph, in-order node.left -> node.right -> node -> node.prev -> node.next
    walk( LEFT*FIRST | RIGHT*SECOND | NODE*THIRD | PREV*FOURTH | NEXT*FIFTH, node, process);
    */
    if ( !node ) return;
    if ( (Node.NODE === scheme[0]) )                      process( node );
    else if ( (Node.PREV === scheme[0]) && node.prev )    walk( scheme, node.prev, process );
    else if ( (Node.LEFT === scheme[0]) && node.left )    walk( scheme, node.left, process );
    else if ( (Node.RIGHT === scheme[0]) && node.right )  walk( scheme, node.right, process );
    else if ( (Node.NEXT === scheme[0]) && node.next )    walk( scheme, node.next, process );
    if ( (Node.NODE === scheme[1]) )                      process( node );
    else if ( (Node.PREV === scheme[1]) && node.prev )    walk( scheme, node.prev, process );
    else if ( (Node.LEFT === scheme[1]) && node.left )    walk( scheme, node.left, process );
    else if ( (Node.RIGHT === scheme[1]) && node.right )  walk( scheme, node.right, process );
    else if ( (Node.NEXT === scheme[1]) && node.next )    walk( scheme, node.next, process );
    if ( (Node.NODE === scheme[2]) )                      process( node );
    else if ( (Node.PREV === scheme[2]) && node.prev )    walk( scheme, node.prev, process );
    else if ( (Node.LEFT === scheme[2]) && node.left )    walk( scheme, node.left, process );
    else if ( (Node.RIGHT === scheme[2]) && node.right )  walk( scheme, node.right, process );
    else if ( (Node.NEXT === scheme[2]) && node.next )    walk( scheme, node.next, process );
    if ( (Node.NODE === scheme[3]) )                      process( node );
    else if ( (Node.PREV === scheme[3]) && node.prev )    walk( scheme, node.prev, process );
    else if ( (Node.LEFT === scheme[3]) && node.left )    walk( scheme, node.left, process );
    else if ( (Node.RIGHT === scheme[3]) && node.right )  walk( scheme, node.right, process );
    else if ( (Node.NEXT === scheme[3]) && node.next )    walk( scheme, node.next, process );
    if ( (Node.NODE === scheme[4]) )                      process( node );
    else if ( (Node.PREV === scheme[4]) && node.prev )    walk( scheme, node.prev, process );
    else if ( (Node.LEFT === scheme[4]) && node.left )    walk( scheme, node.left, process );
    else if ( (Node.RIGHT === scheme[4]) && node.right )  walk( scheme, node.right, process );
    else if ( (Node.NEXT === scheme[4]) && node.next )    walk( scheme, node.next, process );
};

function operate( F, F0, x, i0, i1, ik, strict )
{
    // http://jsperf.com/functional-loop-unrolling/2
    // http://jsperf.com/functional-loop-unrolling/3
    var Fv = F0, i, ii, ikk, di, i0r, i00, i11,
        rem, last = null, x_array = x && is_array(x);
    if ( x_array )
    {
        if ( null == i0 ) i0 = 0;
        if ( null == i1 ) i1 = x.length-1;
    }
    if ( null == ik ) ik = i0 > i1 ? -1 : 1;
    if ( (0 === ik) || (x_array && !x.length) || (0 >= stdMath.floor((i1-i0)/ik)+1) ) return Fv;
    
    if ( 0 > ik )
    {
        // remove not reachable range (not multiple of step ik)
        rem = (i0-i1)%(-ik); if ( rem ) last = i1;
        i1 += rem; i00 = i1; i11 = i0;
        di = -1; ikk = -((-ik) << 4);
    }
    else
    {
        // remove not reachable range (not multiple of step ik)
        rem = (i1-i0)%ik; if ( rem ) last = i1;
        i1 -= rem; i00 = i0; i11 = i1;
        di = 1; ikk = (ik << 4);
    }
    // unroll the rest range mod 16 + remainder
    i0r = i0+ik*(stdMath.floor((i1-i0)/ik+1)&15);
    
    if ( x_array )
    {
        i00 = stdMath.max(0,i00); i11 = stdMath.min(x.length-1,i11);
        for(i=i0; i00<=i && i<=i11 && 0<di*(i0r-i); i+=ik) Fv = F(Fv,x[i],i);
        for(ii=i0r; i00<=ii && ii<=i11; ii+=ikk)
        {
            i =ii; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
            i+=ik; Fv = F(Fv,x[i],i);
        }
        if ( (true===strict) && (null!==last) && (0<=last && last<x.length) ) Fv = F(Fv,x[last],last);
    }
    else
    {
        for(i=i0; i00<=i && i<=i11 && 0<di*(i0r-i); i+=ik) Fv = F(Fv,i,i);
        for(ii=i0r; i00<=ii && ii<=i11; ii+=ikk)
        {
            i =ii; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
            i+=ik; Fv = F(Fv,i,i);
        }
        if ( (true===strict) && (null!==last) ) Fv = F(Fv,last,last);
    }
    return Fv;
}
function array( n, x0, xs )
{
    var x = is_array(n) ? n : ((n=(n|0)) > 0 ? new Array(n) : []);
    n = x.length;
    if ( (0 < n) && (null != x0) )
    {
        xs = xs||0;
        var xk = x0;
        operate("function" === typeof x0 ? function(x,xi,i){
            x[i] = x0(i); return x;
        } : (x0 === +x0 ? function(x,xi,i){
            x[i] = xk; xk += xs; return x;
        } : function(x,xi,i){
            x[i] = x0; return x;
        }), x, x);
    }
    return x;
}
function sum( x, i0, i1, ik )
{
    return operate(addn, 0, x, i0, i1, ik);
}
function product( x, i0, i1, ik )
{
    return operate(muln, 1, x, i0, i1, ik);
}
function pluck( a, k, inplace )
{
    return operate(function(b, ai, i){
        b[i] = ai[k]; return b;
    }, true === inplace ? a : new Array(a.length), a);
}
function reverse( a, a0, a1 )
{
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    if ( a0 < a1 ) for(var t,l=a0,r=a1; l<r; l++,r--) { t = a[l]; a[l] = a[r]; a[r] = t; }
    return a;
}
function gray( b, a, n, a0, a1 )
{ 
    // https://en.wikipedia.org/wiki/Gray_code#n-ary_Gray_code
    var s = 0;
    return operate(is_array(n) ? function(b, ai, i){
        b[i] = n[i] > 0 ? (ai + s) % n[i] : 0; s += n[i] - b[i]; return b;
    } : function(b, ai, i){
        b[i] = (ai + s) % n; s += n - b[i]; return b;
    }, b, a, a0, a1);
}
function modulo( b, a, m, c1, c0, a0, a1 )
{
    if ( null == c1 ) c1 = 1;
    if ( null == c0 ) c0 = 0;
    return operate(2===m ? function(b, ai, i){
        b[i] = c0 + c1*(ai&1); return b;
    } : function(b, ai, i){
        b[i] = c0 + c1*(ai%m); return b;
    }, b, a, a0, a1);
}
function affine( b, a, c1, c0, a0, a1 )
{
    if ( null == c1 && null == c0 ) return b;
    return operate(function(b, ai, i){
        b[i] = c0 + c1*ai; return b;
    }, b, a, a0, a1);
}
function fdiff/*finite_difference*/( b, a, c1, c0, a0, a1 )
{
    if ( null == c1 ) c1 = 1;
    if ( null == c0 ) c0 = 0;
    var d0 = 0;
    return operate(function(b, ai, i){
        b[i] = c0 + c1*(ai-d0); d0 = ai; return b;
    }, b, a, a0, a1);
}
function psum/*partial_sum*/( b, a, c1, c0, a0, a1 )
{
    if ( null == c1 ) c1 = 1;
    if ( null == c0 ) c0 = 0;
    var s = 0;
    return operate(function(b, ai, i){
        s += ai; b[i] = c0 + c1*s; return b;
    }, b, a, a0, a1);
}
function kronecker/*tensor_product*/( /* var args here */ )
{
    // https://en.wikipedia.org/wiki/Outer_product
    // https://en.wikipedia.org/wiki/Kronecker_product
    // https://en.wikipedia.org/wiki/Tensor_product
    var k, a, r, l, i, j, vv, tensor,
        v = arguments, nv = v.length,
        kl, product;
    
    if ( !nv ) return [];
    
    if ( true === v[0] )
    {
        // flat tensor product
        for(kl=v[1].length,k=2; k<nv; k++) kl *= v[ k ].length;
        product = new Array( kl );
        for(k=0; k<kl; k++)
        {
            tensor = 0;
            for(j=1,r=k,a=1; a<nv; a++)
            {
                l = v[ a ].length;
                i = r % l;
                r = ~~(r / l);
                vv = v[ a ][ i ];
                tensor += j*vv;
                j *= l;
            }
            product[ k ] = tensor;
        }
    }
    else
    {
        // component tensor product
        for(kl=v[0].length,k=1; k<nv; k++) kl *= v[ k ].length;
        product = new Array( kl );
        for(k=0; k<kl; k++)
        {
            tensor = [ ];
            for(r=k,a=nv-1; a>=0; a--)
            {
                l = v[ a ].length;
                i = r % l;
                r = ~~(r / l);
                vv = v[ a ][ i ];
                if ( is_array(vv) )
                {
                    // kronecker can be re-used to create higher-order products
                    // i.e kronecker(alpha, beta, gamma) and kronecker(kronecker(alpha, beta), gamma)
                    // should produce exactly same results
                    for (j=vv.length-1; j>=0; j--)
                        tensor.unshift( vv[ j ] );
                }
                else
                {
                    tensor.unshift( vv );
                }
            }
            product[ k ] = tensor;
        }
    }
    return product;
}
function intersection( comm, a, b, dir, a0, a1, b0, b1 )
{
    dir = -1 === dir ? -1 : 1;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    if ( null == b0 ) b0 = 0;
    if ( null == b1 ) b1 = b.length-1;
    
    var ak = a0 > a1 ? -1 : 1, bk = b0 > b1 ? -1 : 1,
        al = ak*(a1-a0)+1, bl = bk*(b1-b0)+1, ai = a0, bi = b0, il = 0;
    if ( null == comm ) comm = new Array(stdMath.min(al,bl));
    if ( 0 === comm.length ) return comm;
    
    // O(min(al,bl))
    // assume lists are already sorted ascending/descending (indepentantly)
    while( (0 <= ak*(a1-ai)) && (0 <= bk*(b1-bi)) )
    {
        if      ( (1===dir && a[ai]<b[bi]) || (-1===dir && a[ai]>b[bi]) )
        { 
            ai+=ak; 
        }
        else if ( (1===dir && a[ai]>b[bi]) || (-1===dir && a[ai]<b[bi]) )
        { 
            bi+=bk; 
        }
        else // they're equal
        {
            comm[il++] = a[ ai ];
            ai+=ak; bi+=bk;
        }
    }
    // truncate if needed
    if ( il < comm.length ) comm.length = il;
    return comm;
}
function difference/*complement*/( diff, a, b, dir, a0, a1, b0, b1 )
{
    dir = -1 === dir ? -1 : 1;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a === +a ? a-1 : a.length-1;
    if ( null == b0 ) b0 = 0;
    if ( null == b1 ) b1 = b ? b.length-1 : -1;
    
    var ak = a0 > a1 ? -1 : 1, bk = b0 > b1 ? -1 : 1,
        al = ak*(a1-a0)+1, bl = bk*(b1-b0)+1, ai = a0, bi = a0, dl = 0;
    if ( !b || !b.length ) return a === +a ? array(a, a0, ak) : (a ? a.slice() : a);
    if ( null == diff ) diff = new Array(al);
    
    // O(al)
    // assume lists are already sorted ascending/descending (independantly)
    if ( a === +a )
    {
        while( (0 <= ak*(a1-ai)) && (0 <= bk*(b1-bi)) )
        {
            if      ( ai === b[bi] )
            {
                ai+=ak; bi+=ak;
            }
            else if ( (1===dir && ai>b[bi]) || (-1===dir && ai<b[bi]) )
            {
                bi+=bk; 
            }
            else//if ( (1===dir && ai<b[bi]) || (-1===dir && ai>b[bi]) )
            { 
                diff[dl++] = ai; ai+=ak;
            }
        }
        while( 0 <= ak*(a1-ai) ) { diff[dl++] = ai; ai+=ak; }
    }
    else
    {
        while( (0 <= ak*(a1-ai)) && (0 <= bk*(b1-bi)) )
        {
            if      ( a[ai] === b[bi] )
            {
                ai+=ak; bi+=ak;
            }
            else if ( (1===dir && a[ai]>b[bi]) || (-1===dir && a[ai]<b[bi]) )
            {
                bi+=bk; 
            }
            else//if ( (1===dir && a[ai]<b[bi]) || (-1===dir && a[ai]>b[bi]) )
            { 
                diff[dl++] = a[ ai ]; ai+=ak;
            }
        }
        while( 0 <= ak*(a1-ai) ) { diff[dl++] = a[ai]; ai+=ak; }
    }
    // truncate if needed
    if ( dl < diff.length ) diff.length = dl;
    return diff;
}
function merge/*union*/( union, a, b, dir, a0, a1, b0, b1, indices, unique, inplace )
{
    dir = -1 === dir ? -1 : 1;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    if ( null == b0 ) b0 = 0;
    if ( null == b1 ) b1 = b.length-1;
    if ( true === indices )
    {
        unique = false;
    }
    else
    {
        indices = false;
        unique = false !== unique;
    }
    inplace = true === inplace;
    
    var ak = a0 > a1 ? -1 : 1, bk = b0 > b1 ? -1 : 1,
        al = ak*(a1-a0)+1, bl = bk*(b1-b0)+1, ul = al+bl,
        ai = a0, bi = b0, ui = 0, last = null, with_duplicates = !unique;
    if ( null == union ) union = new Array(ul);
    if ( 0 === union.length ) return inplace ? a : union;
    
    // O(al+bl)
    // assume lists are already sorted ascending/descending (independantly), even with duplicate values
    while( (0 <= ak*(a1-ai)) && (0 <= bk*(b1-bi)) )
    {
        if      (unique && ui) // handle any possible duplicates inside SAME list
        {
            if ( a[ai] === last )
            {
                ai+=ak;
                continue;
            }
            else if ( b[bi] === last )
            {
                bi+=bk;
                continue;
            }
        }
        if ( indices )
        {
            if      ( (1===dir && a[ai][0]<b[bi][0]) || (-1===dir && a[ai][0]>b[bi][0]) )
            { 
                union[ui++] = last=a[ai];
                ai+=ak;
            }
            else if ( (1===dir && a[ai][0]>b[bi][0]) || (-1===dir && a[ai][0]<b[bi][0]) )
            { 
                union[ui++] = last=b[bi];
                bi+=bk;
            }
            else // they're equal, push one unique
            {
                // make it stable
                union[ui++] = last=(a[ai][1] < b[bi][1] ? a[ai] : b[bi]);
                if ( with_duplicates ) union[ui++] = (a[ai][1] < b[bi][1] ? b[bi] : a[ai]);
                ai+=ak; bi+=bk;
            }
        }
        else
        {
            if      ( (1===dir && a[ai]<b[bi]) || (-1===dir && a[ai]>b[bi]) )
            { 
                union[ui++] = last=a[ai];
                ai+=ak;
            }
            else if ( (1===dir && a[ai]>b[bi]) || (-1===dir && a[ai]<b[bi]) )
            { 
                union[ui++] = last=b[bi];
                bi+=bk;
            }
            else // they're equal, push one unique
            {
                union[ui++] = last=a[ai];
                if ( with_duplicates ) union[ui++] = b[bi];
                ai+=ak; bi+=bk;
            }
        }
    }
    while( 0 <= ak*(a1-ai) )
    {
        if ( with_duplicates || (a[ai]!==last) )
        {
            union[ui++] = last=a[ai];
            ai+=ak;
        }
    }
    while( 0 <= bk*(b1-bi) )
    {
        if ( with_duplicates || (b[bi]!==last) )
        {
            union[ui++] = last=b[bi];
            bi+=bk;
        }
    }
    if ( inplace )
    {
        // move the merged back to the a array
        for(ai=a0,ui=0; ui<ul; ui++,ai+=ak) a[ai] = union[ui];
        return a;
    }
    else
    {
        // truncate if needed
        if ( ui < union.length ) union.length = ui;
        return union;
    }
}
function mergesort( a, dir, indices, a0, a1 )
{
    // http://en.wikipedia.org/wiki/Merge_sort
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    var ak = a0 > a1 ? -1 : 1, N = ak*(a1-a0)+1;
    indices = true === indices;
    // in-place
    if ( 1 >= N ) return indices ? (1 === N ? [a0] : []) : a;
    dir = -1 === dir ? -1 : 1;
    var logN = N, j, n, b, size = 1, size2 = 2, min = stdMath.min, aux = new Array(N);
    if ( indices )
    {
        j = a0; b = new Array(N);
        a = operate(function(b,bi,i){b[i]=[a[j],j]; j+=ak; return b;}, b, b);
        a0 = 0; a1 = N-1; ak = 1;
    }
    // O(NlgN)
    while( 0 < logN )
    {
        operate(function(X,j){
            merge(aux, a, a, dir, a0+ak*j, a0+ak*(j+size-1), a0+ak*(j+size), a0+ak*min(j+size2-1, N-1), indices, false, true);
        }, null, null, 0, N-size, size2);
        size <<= 1; size2 <<= 1; logN >>= 1;
    }
    return indices ? pluck(a, 1, true) : a;
}
function shuffle( a, cyclic, a0, a1 )
{
    // http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Sattolo.27s_algorithm
    var rndInt = FnList.rndInt, N, offset = true === cyclic ? 1 : 0;
    // O(n)
    if ( is_array(a0) )
    {
        if ( 1 < (N=a0.length) ) operate(function(a){
            if ( offset < N-- )
            {
                var perm = rndInt(0, N-offset), swap = a[ a0[N] ]; 
                a[ a0[N] ] = a[ a0[perm] ]; a[ a0[perm] ] = swap; 
            }
            return a;
        }, a, a0, 0, N-1);
    }
    else
    {
        if ( null == a0 ) a0 = 0;
        if ( null == a1 ) a1 = a.length-1;
        if ( 1 < (N=a1-a0+1) ) operate(function(a){
            if ( offset < N-- )
            {
                var perm = rndInt(0, N-offset), swap = a[ a0+N ]; 
                a[ a0+N ] = a[ a0+perm ]; a[ a0+perm ] = swap; 
            }
            return a;
        }, a, a, 0, N-1);
    }
    return a;
}
function pick( a, k, sorted, repeated, backup, a0, a1 )
{
    // http://stackoverflow.com/a/32035986/3591273
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    var rndInt = FnList.rndInt, picked, i, selected, value, n = a1-a0+1;
    k = stdMath.min( k, n );
    sorted = true === sorted;
    
    picked = new Array(k);
    if ( true === repeated )
    {
        n = n-1;
        for(i=0; i<k; i++) // O(k) times
            picked[ i ] = a[ a0+rndInt( 0, n ) ];
        if ( sorted ) mergesort( picked );// O(klogk) times, average/worst-case
        return picked;
    }
    
    // partially shuffle the array, and generate unbiased selection simultaneously
    // this is a variation on fisher-yates-knuth shuffle
    for(i=0; i<k; i++) // O(k) times
    { 
        selected = rndInt( 0, --n ); // unbiased sampling n * n-1 * n-2 * .. * n-k+1
        value = a[ a0+selected ];
        a[ a0+selected ] = a[ a0+n ];
        a[ a0+n ] = value;
        picked[ i ] = value;
        backup && (backup[ i ] = selected);
    }
    if ( backup )
    {
        // restore partially shuffled input array from backup
        for(i=k-1; i>=0; i--) // O(k) times
        { 
            selected = backup[ i ];
            value = a[ a0+n ];
            a[ a0+n ] = a[ a0+selected ];
            a[ a0+selected ] = value;
            n++;
        }
    }
    if ( sorted ) mergesort( picked );// O(klogk) times, average/worst-case
    return picked;
}
function binarysearch( v, a, dir, a0, a1 )
{
    // binary search O(logn)
    dir = -1 === dir ? -1 : 1;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    var l=a0, r=a1, m, am;
    if ( v === a[l] ) return l;
    if ( v === a[r] ) return r;
    while(l<r)
    {
        m = l+((r-l+1)>>>1);
        am = a[m];
        if ( v === am ) return m;
        else if ( (1===dir && v<am) || (-1===dir && v>am) ) r = m-1;
        else l = m+1;
    }
    return -1;
}
function sorter( )
{
    // Array multi - sorter utility
    // returns a sorter that can (sub-)sort by multiple (nested) fields 
    // each ascending or descending independantly
    var arr = this, i, args = arguments, l = args.length,
        a, b, avar, bvar, variables, step, lt, gt,
        field, filter_args, sorter_args, desc, dir, sorter,
        ASC = '|^', DESC = '|v';
    // |^ after a (nested) field indicates ascending sorting (default), 
    // example "a.b.c|^"
    // |v after a (nested) field indicates descending sorting, 
    // example "b.c.d|v"
    if ( l )
    {
        step = 1;
        sorter = [];
        variables = [];
        sorter_args = [];
        filter_args = []; 
        for (i=l-1; i>=0; i--)
        {
            field = args[i];
            // if is array, it contains a filter function as well
            filter_args.unshift('f'+i);
            if ( field.push )
            {
                sorter_args.unshift(field[1]);
                field = field[0];
            }
            else
            {
                sorter_args.unshift(null);
            }
            dir = field.slice(-2);
            if ( DESC === dir ) 
            {
                desc = true;
                field = field.slice(0,-2);
            }
            else if ( ASC === dir )
            {
                desc = false;
                field = field.slice(0,-2);
            }
            else
            {
                // default ASC
                desc = false;
            }
            field = field.length ? '["' + field.split('.').join('"]["') + '"]' : '';
            a = "a"+field; b = "b"+field;
            if ( sorter_args[0] ) 
            {
                a = filter_args[0] + '(' + a + ')';
                b = filter_args[0] + '(' + b + ')';
            }
            avar = 'a_'+i; bvar = 'b_'+i;
            variables.unshift(''+avar+'='+a+','+bvar+'='+b+'');
            lt = desc ?(''+step):('-'+step); gt = desc ?('-'+step):(''+step);
            sorter.unshift("("+avar+" < "+bvar+" ? "+lt+" : ("+avar+" > "+bvar+" ? "+gt+" : 0))");
            step <<= 1;
        }
        // use optional custom filters as well
        return (new Function(
                filter_args.join(','), 
                ['return function(a,b) {',
                 '  var '+variables.join(',')+';',
                 '  return '+sorter.join('+')+';',
                 '};'].join("\n")
                ))
                .apply(null, sorter_args);
    }
    else
    {
        a = "a"; b = "b"; lt = '-1'; gt = '1';
        sorter = ""+a+" < "+b+" ? "+lt+" : ("+a+" > "+b+" ? "+gt+" : 0)";
        return new Function("a,b", 'return '+sorter+';');
    }
}

FnList = {
 VERSION: "1.0.0"

,is_string: is_string
,is_array: is_array
,array: array
,operate: operate
,sum: sum
,product: product
,gray: gray
,affine: affine
,modulo: modulo
,finitedifference: fdiff
,partialsum: psum
,reverse: reverse
,kronecker: kronecker
,intersection: intersection
,difference: difference
,union: merge
,search: binarysearch
,sort: mergesort
,sorter: sorter
,shuffle: shuffle
,pick: pick
,pluck: pluck
,rndInt: rndInt   

};

// export it
return FnList;
});
