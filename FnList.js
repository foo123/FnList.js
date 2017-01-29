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

var stdMath = Math, HAS = Object.prototype.hasOwnProperty, toString = Object.prototype.toString,
    FnList;

// utility methods
function is_array( x ) { return (x instanceof Array) || ('[object Array]' === toString.call(x)); }
function is_string( x ) { return (x instanceof String) || ('[object String]' === toString.call(x)); }
function rndInt( m, M ) { return stdMath.round( (M-m)*stdMath.random( ) + m ); }
function addn( s, x ) { return s+x; }
function muln( p, x ) { return p*x; }
function swap( a, i, j, t ) { t=a[i]; a[i]=a[j]; a[j]=t; return a; }

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
function pluck( b, a, k )
{
    return operate(function(b, ai, i){
        b[i] = ai[k]; return b;
    }, b, a);
}
function reflect( b, a, a0, a1 )
{
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    if ( a0 < a1 ) for(var t,l=a0,r=a1; l<r; l++,r--) { t = a[l]; b[l] = a[r]; b[r] = t; }
    return b;
}
function rotate( a, m, a0, a1 )
{
    // http://codinghelmet.com/?path=exercises/rotating-array
    var n = a.length, nn, dir = -1/* rotate left */, p, p2, nm, t;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = n-1;
    nn = a1-a0+1;
    if ( 0 > m ){ m = -m; dir = -dir; /* rotate right */}
    p = a0;
    while(0 < m && m < nn )
    {
        p2 = p + nn - m; nm = m;
        if ( m+m > nn )
        {
            p2 = p + m;
            nm = nn - m;
        }
        operate(function(a,i){return swap(a, p+i, p2+i);}, a, null, 0, nm-1, 1);
        if ( m+m <= n )
        {
            nn -= m;
        }
        else
        {
            p += nn - m;
            t = m; m = m+m-nn; nn = t;
        }
    }
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
function fdiff/*finite_difference*/( b, a, c1, c0, a0, a1, b0, b1 )
{
    if ( null == a ) return null;
    if ( null == c1 ) c1 = 1;
    if ( null == c0 ) c0 = 0;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    if ( null == b0 ) b0 = a0;
    if ( null == b1 ) b1 = a1;
    var d0 = 0, bk = b0 > b1 ? -1 : 1, bi = b0;
    return operate(function(b, ai, i){
        ai=c0+c1*ai; b[bi] = ai-d0; d0 = ai; bi+=bk; return b;
    }, b, a, a0, a1);
}
function psum/*partial_sum*/( b, a, c1, c0, a0, a1, b0, b1 )
{
    if ( null == a ) return null;
    if ( null == c1 ) c1 = 1;
    if ( null == c0 ) c0 = 0;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    if ( null == b0 ) b0 = a0;
    if ( null == b1 ) b1 = a1;
    var s = 0, bk = b0 > b1 ? -1 : 1, bi = b0;
    return operate(function(b, ai, i){
        s+=ai; b[bi] = c0+c1*s; bi+=bk; return b;
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
    // see also http://codinghelmet.com/?path=exercises/array-intersection
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
                if ( (1===dir && a[ai][1]<b[bi][1]) || (-1===dir && a[ai][1]>b[bi][1]) )
                {
                    union[ui++] = last=a[ai];
                    if ( with_duplicates ) union[ui++] = b[bi];
                }
                else
                {
                    union[ui++] = last=b[bi];
                    if ( with_duplicates ) union[ui++] = a[ai];
                }
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
        for(ai=0>ak?a1:a0,ui=0; ui<ul; ui++,ai++) a[ai] = union[ui];
        return a;
    }
    else
    {
        // truncate if needed
        if ( ui < union.length ) union.length = ui;
        return union;
    }
}
function partition( a, ip, i0, i1 )
{
    var n = a.length, pivot, index, i, t;
    if ( null == i0 ) i0 = 0;
    if ( null == i1 ) i1 = n-1;
    pivot = a[ip];
    t = a[ip]; a[ip] = a[i1]; a[i1] = t;
    index = i0;
    for(i=i0; i<i1; i++)  // i0 ≤ i < i1
    {
        if ( a[i] <= pivot )
        {
            t = a[i]; a[i] = a[index]; a[index] = t;
            index++;
        }
    }
    t = a[index]; a[index] = a[i1]; a[i1] = t;
    return index;
}
function sortedrun( a, a0, a1, index, indices )
{
    // findout already sorted chunks either ascending or descending
    var ap, ai, i, i0, i1, d0, i2, i3, d1;
    index[0] = -1; index[1] = -1; index[2] = 0;
    index[3] = -1; index[4] = -1; index[5] = 0;
    d0 = 0; d1 = 0;
    i0 = a0; i1 = -1;
    for(ap=indices?a[i0][0]:a[i0],i=i0+1; i<=a1; i++)
    {
        ai = indices?a[i][0]:a[i];
        if ( ap < ai )
        {
            if ( -1 === d0 ) { i1 = i-1; break; }
            else if ( 0 === d0 ) d0 = 1;
        }
        else if ( ap > ai )
        {
            if ( 1 === d0 ) { i1 = i-1; break; }
            else if ( 0 === d0 ) d0 = -1;
        }
        ap = ai;
    }
    if ( 0 === d0 ) d0 = 1;
    if ( -1 === i1 )
    {
        i1 = a1; index[0] = i0; index[1] = i1; index[2] = d0;
    }
    else
    {
        i2 = i1+1; i3 = -1;
        for(ap=indices?a[i2][0]:a[i2],i=i2+1; i<=a1; i++)
        {
            ai = indices?a[i][0]:a[i];
            if ( ap < ai )
            {
                if ( -1 === d1 ) { i3 = i-1; break; }
                else if ( 0 === d1 ) d1 = 1;
            }
            else if ( ap > ai )
            {
                if ( 1 === d1 ) { i3 = i-1; break; }
                else if ( 0 === d1 ) d1 = -1;
            }
            ap = ai;
        }
        if ( -1 === i3 ) i3 = a1;
        if ( 0 === d1 ) d1 = 1;
        index[0] = i0; index[1] = i1; index[2] = d0;
        index[3] = i2; index[4] = i3; index[5] = d1;
    }
}
function mergesort/*naturalmergesort*/( a, dir, indices, a0, a1 )
{
    // Natutal http://en.wikipedia.org/wiki/Merge_sort
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    indices = true === indices;
    // in-place
    if ( a0 >= a1 ) return indices ? (a0 === a1 ? [a0] : []) : a;
    var N = a1-a0+1, aux = new Array(N),  index = [-1,-1,0,-1,-1,0], i0, i1, i0p, i1p;
    if ( indices )
    {
        a = operate(function(b,ai,i){b[i-a0]=[ai,i]; return b;}, new Array(N), a, a0, a1, 1);
        a0 = 0; a1 = N-1;
    }
    // O(N) average, O(NlgN) worst case
    i0p = a0; i1p = -1;
    dir = -1 === dir ? -1 : 1;
    do{
        // find already sorted chunks
        // O(n)
        sortedrun(a, a0, a1, index, indices);
        if ( -1 === index[3] )
        {
            // already sorted, reflect if sorted reversely
            // O(n)
            if ( dir !== index[2] && a0 < a1 ) reflect(a, a, a0, a1);
            i0 = a0; i1 = a1;
        }
        else
        {
            // merge partialy sorted chunks appropriately into one run
            // O(n)
            index[2] *= dir; index[5] *= dir;
            merge(aux, a, a, dir, 0>index[2]?index[1]:index[0], 0>index[2]?index[0]:index[1], 0>index[5]?index[4]:index[3], 0>index[5]?index[3]:index[4], indices, false, true);
            i0 = index[0]; i1 = index[4];
        }
        // merge with the previous run
        // O(n)
        if ( -1 !== i1p ) merge(aux, a, a, dir, i0p, i1p, i0, i1, indices, false, true);
        // update starting point for next chunk
        i1p = i1; a0 = i1+1;
    }while( a0 <= a1 );
    return indices ? pluck(a, a, 1) : a;
}
function partition_indexed( a, ip, i0, i1 )
{
    var pivot = a[ip][0], index = i0, i, t;
    t = a[ip]; a[ip] = a[i1]; a[i1] = t;
    for(i=i0; i<i1; i++)  // i0 ≤ i < i1
    {
        if ( a[i][0] <= pivot )
        {
            t = a[i]; a[i] = a[index]; a[index] = t;
            index++;
        }
    }
    t = a[index]; a[index] = a[i1]; a[i1] = t;
    return index;
}
function mergesort_indexed( a, dir, a0, a1 )
{
    // Natutal http://en.wikipedia.org/wiki/Merge_sort
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = a.length-1;
    // in-place
    if ( a0 >= a1 ) return a;
    var N = a1-a0+1, aux = new Array(N),  index = [-1,-1,0,-1,-1,0], i0, i1, i0p, i1p;
    // O(N) average, O(NlgN) worst case
    i0p = a0; i1p = -1;
    dir = -1 === dir ? -1 : 1;
    do{
        // find already sorted chunks
        // O(n)
        sortedrun(a, a0, a1, index, true);
        if ( -1 === index[3] )
        {
            // already sorted, reflect if sorted reversely
            // O(n)
            if ( dir !== index[2] && a0 < a1 ) reflect(a, a, a0, a1);
            i0 = a0; i1 = a1;
        }
        else
        {
            // merge partialy sorted chunks appropriately into one run
            // O(n)
            index[2] *= dir; index[5] *= dir;
            merge(aux, a, a, dir, 0>index[2]?index[1]:index[0], 0>index[2]?index[0]:index[1], 0>index[5]?index[4]:index[3], 0>index[5]?index[3]:index[4], true, false, true);
            i0 = index[0]; i1 = index[4];
        }
        // merge with the previous run
        // O(n)
        if ( -1 !== i1p ) merge(aux, a, a, dir, i0p, i1p, i0, i1, true, false, true);
        // update starting point for next chunk
        i1p = i1; a0 = i1+1;
    }while( a0 <= a1 );
    return a;
}
function is_sorted( a, dir, a0, a1 )
{
    var i, ap, ai, n = a.length, N;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = n-1;
    // O(n)
    if ( null == dir || 0 === dir )
    {
        // findout if and how it is sorted
        dir = 0;
        for(ap=a[a0],i=a0+1; i<=a1; i++)
        {
            ai = a[i];
            if ( ap < ai )
            {
                if ( -1 === dir ) return 0;
                else if ( 0 === dir ) dir = 1;
            }
            else if ( ap > ai )
            {
                if ( 1 === dir ) return 0;
                else if ( 0 === dir ) dir = -1;
            }
            ap = ai;
        }
        return 0 === dir ? 1 : dir;
    }
    else
    {
        // check that it is sorted by dir
        dir = -1 === dir ? -1 : 1;
        if ( a0 >= a1 ) return dir;
        if ( -1 === dir )
        {
            // reverse sorted, descending
            for(ap=a[a0],i=a0+1; i<=a1; i++)
            {
                ai = a[i];
                if ( ap < ai ) return 0;
                else ap = ai;
            }
        }
        else
        {
            // sorted, ascending
            for(ap=a[a0],i=a0+1; i<=a1; i++)
            {
                ai = a[i];
                if ( ap > ai ) return 0;
                else ap = ai;
            }
        }
        return dir;
    }
}
function selectminmax( a, a0, a1, index )
{
    // non destructive, can return index of kth order statistic, instead of value
    // find min/max in O(n)
    for(var k0=a[a0],k1=a[a0],ik0=a0,ik1=a0,i=a0+1; i<=a1; i++)
    {
        if ( a[i] < k0 ) { k0 = a[i]; ik0 = i; }
        if ( a[i] > k1 ) { k1 = a[i]; ik1 = i; }
    }
    return index ? [ik0,ik1] : [k0,k1];
}
function selectsorted( a, ks, a0, a1, dir, index )
{
    // non destructive, can return index of kth order statistic, instead of value
    // already sorted
    var n = a1-a0+1;
    // reverse sorted
    if ( 0 > dir )  ks = n-1-ks;
    // sorted
    return index ? a0+ks : a[a0+ks];
}
function selectkth5( a, ks, a0, a1, index, ia )
{
    // non destructive, can return index of kth order statistic, instead of value
    if ( ia )
    {
        mergesort_indexed(ia, 1, a0, a1);
        return index ? ia[a0+ks][1] : ia[a0+ks][0];
    }
    else
    {
        var i = mergesort(a, 1, true, a0, a1);
        //if ( ks >= i.length ) ks = i.length-1;
        return index ? i[ks] : a[i[ks]];
    }
}
function selectkth( a, ks, a0, a1, index, ia, m, mi )
{
    // select fast (~O(n)) the kth item (or range of items) from a (not necessarily sorted) array a using select with median of medians algorithm
    // (http://www.cs.cornell.edu/courses/cs2110/2009su/Lectures/examples/MedianFinding.pdf)
    // O(n)
    var n = a1-a0+1, nby5, nmod5, k, i, mk, medofmed, pivot;
    
    // non destructive, can return index of kth order statistic, instead of value
    if ( 1 >= n ) return index ? a0 : a[a0];
    if ( null == ia ) ia = array(n, function(i){return [a[a0+i],a0+i];});
    if ( 5 >= n ) return selectkth5(ia, ks, 0, n-1, index, ia);
    
    nmod5 = n%5; nby5 = stdMath.ceil(n/5);
    if ( null == m ) { m = new Array(nby5); mi = new Array(nby5); }
    k = 0;
    if ( 0 < nmod5 )
    {
        mk = selectkth5(ia, nmod5>>>1, 0, nmod5-1, 1, ia);
        m[k] = ia[mk][0]; mi[k] = [m[k], k, mk]; k++;
    }
    for(i=nmod5; i<n; i+=5)
    {
        mk = selectkth5(ia, 2, i, i+4, 1, ia);
        m[k] = ia[mk][0]; mi[k] = [m[k], k, mk]; k++;
    }
    medofmed = 1 === nby5 ? 0 : selectkth(m, nby5>>>1, 0, nby5-1, 1, mi);
    pivot = partition_indexed(ia, mi[medofmed][2], 0, n-1);
    if ( pivot > ks ) return selectkth(a, ks, 0, pivot-1, index, ia, m, mi);
    else if ( pivot < ks ) return selectkth(a, ks, pivot+1, n-1, index, ia, m, mi);
    else return index ? ia[pivot][1] : ia[pivot][0];
}
function fastselect( a, ks, index, a0, a1 )
{
    // select fast from arbitrary list the kth order statistic using the fastest approach depending on input
    // non destructive, can return index of kth order statistic, instead of value
    var N = a.length, n, m, dir;
    if ( null == a0 ) a0 = 0;
    if ( null == a1 ) a1 = N-1;
    n = a1-a0+1; ks = stdMath.max(0, stdMath.min(ks, n-1));
    if ( 0 === ks || n-1 === ks )
    {
        // min/max, get it in O(n)
        m = selectminmax(a, a0, a1, index);
        return 0 === ks ? m[0] : m[1];
    }
    // already sorted? get kth in O(n), else use medianofmedians pivot select in O(6n)
    return (dir=is_sorted(a,0,a0,a1)) ? selectsorted(a, ks, a0, a1, dir, index) : (5 >= n ? selectkth5(a, ks, a0, a1, index) : selectkth(a, ks, a0, a1, index));
}
function shuffle( a, a0, a1 )
{
    // http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#Sattolo.27s_algorithm
    var rndInt = FnList.rndInt, N;
    // O(n)
    if ( is_array(a0) )
    {
        if ( 1 < (N=a0.length) ) operate(function(a){
            if ( 0 < N-- )
            {
                var perm = rndInt(0, N), swap = a[ a0[N] ]; 
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
            if ( 0 < N-- )
            {
                var perm = rndInt(0, N), swap = a[ a0+N ]; 
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
,reflect: reflect
,rotate: rotate
,kronecker: kronecker
,intersection: intersection
,difference: difference
,union: merge
,partition: partition
,search: binarysearch
,sort: mergesort
,is_sorted: is_sorted
,select: fastselect
//,hselect: fasthselect
,sorter: sorter
,shuffle: shuffle
,pick: pick
,pluck: pluck
,rndInt: rndInt   
,Node: Node

};

// export it
return FnList;
});
