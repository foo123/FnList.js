# FnList.js


![FnList.js](/fnlist.jpg)


FnList.js: Efficient (functional) methods for processing lists/sets/vectors/strings or arbitrary range of numbers

###Routines

* `operate` basic routine to operate on lists or given range of numbers using fast loop unrolling
* `union` get union of (independantly sorted) lists with or without duplicates
* `intersection` get intersection of (independantly sorted) lists
* `difference` get difference/complement of (independantly sorted) lists
* `sort` sort a list (natural mergesort)
* `sorter` get custom comparison functions to be used in sort methods based on arbitrary hierarchical/nested keys sorted ascending or descending independantly
* `is_sorted` check whether a list is already sorted ascending or descending and/or findout whether a list is sorted and in what direction
* `select` select `kth` order statistic or range of order statistics (or their indices) (median of medians) from a (not necessarily sorted) list (partialy complete)
* `search` search a (sorted) list and return index (binary search)
* `shuffle` shuffle a list (fisher-yates-knuth shuffle)
* `pick` pick a given number of samples from a list efficiently and unbiasedly (variation of partial shuffle)
* `kronecker` compute tensor (kronecker) product of a set of lists
* `finitedifference` compute finite differences from a list
* `partialsum` compute partial sums from a list
* `gray` compute (arbitrary base) gray code of a list
* `reflect` reflect a list (reverse direction)
* `rotate` rotate a list (modulo cyclic shift)


###Todo

* generalise to `n-dimensional` (strided) lists/arrays (eg `matrix` operations, `image` data, see [FILTER.js](https://github.com/foo123/FILTER.js))
* <del>add some basic vector/matrix (sub-)routines (eg `BLAS`, see [FILTER.js](https://github.com/foo123/FILTER.js))</del>
* <del>optimise routines to use `asm.js` if applicable</del>
