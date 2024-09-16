var stdlib = window.StdLib = {};

// Quick helper that pops two elements from the stack, reduces them with a function, and pushes the result back onto the stack.
function stackReduce(fn)
{
	return function() {
		var last = this.stack.pop();
		var first = this.stack.pop();

		this.stack.push(fn.call(this, first, last));
	}
}


// -- Booleans and comparison functions -- //

// true
stdlib['true'] = function() { this.stack.push(true); }

// false
stdlib['false'] = function() { this.stack.push(false); }

// 1 2 <     => [true]
stdlib['<']  = stackReduce(function(a, b) { return a < b; });

// 1 2 >     => [false]
stdlib['>']  = stackReduce(function(a, b) { return a > b; });

// 1 1 <=    => [true]
stdlib['<='] = stackReduce(function(a, b) { return a <= b; });

// 1 2 >=    => [false]
stdlib['>='] = stackReduce(function(a, b) { return a >= b; });

// 1 2 ==    => [false]
stdlib['=='] = stackReduce(function(a, b) { return a == b; });

// -- Control flow -- //

// true { 2 } if => [2]
stdlib.if = function() {
	var fn = this.stack.pop();
	var bool = this.stack.pop();

	if(bool) this.callFunction(fn);
}

// false { 2 } { 3 } ifelse => [3]
stdlib.ifelse = function() {
	var elsefn = this.stack.pop();
	var iffn = this.stack.pop();
	var bool = this.stack.pop();

	if(bool)
		this.callFunction(iffn);
	else
		this.callFunction(elsefn);
}

// -- Basic arithmetic -- //

// 1 2 + => [3]
// 'oo' 'br' + 'oobr'
stdlib['+'] = stackReduce(function(a, b) { return a + b; });

// 3 2 - => [1]
stdlib['-'] = stackReduce(function(a, b) { return a - b; });

// 2 4 * => [8]
stdlib['*'] = stackReduce(function(a, b) { return a * b; });

// 8 2 / => [4]
stdlib['/'] = stackReduce(function(a, b) { return a / b; });

// 10 5 % => [0]
stdlib['%'] = stackReduce(function(a, b) { return a % b; });

// -- Stack operations -- //

// 1 2 swp => [2, 1]
stdlib.swp = function() {
	var last = this.stack.pop();
	var first = this.stack.pop();
	this.stack.push(last, first);
}

// 2 dup => [2, 2]
stdlib.dup = function() {
	var val = this.stack.pop();
	this.stack.push(val, val);
}

// 1 2 3  2 nth => [1, 2, 3, 1]
stdlib.nth = function() {
	const offset = this.stack.pop();
	const index = this.stack.length - 1 - offset;
	const value = this.stack[index];
	this.stack.push(value)
}

// 1 2 3  1 xch => [1,3,2]
stdlib.xch = function() {
	const offset = this.stack.pop();
	const top = this.stack.length - 1;
	const elm = top - offset;
	const s = this.stack;
	[s[top], s[elm]] = [s[elm], s[top]];
}

// 1 2 drop => [1]
stdlib.drop = function() {
	this.stack.pop();
}

// 1 2 3 clear => []
stdlib.clear = function() {
	this.stack = [];
}

// -- Function functions -- //

// "functionName" call
// { "Anonymous function" } call
stdlib.call = function() {
	var fn = this.stack.pop();
	this.callFunction(fn);
}

// "square" { dup * } def => []
// 2 square => [4]
stdlib.def = function() {
	var fn = this.stack.pop();
	var name = this.stack.pop();

	var ctx = this;

	this.registerFunction(name, function() { fn.apply(ctx); });
}

