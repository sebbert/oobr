window.Runtime = function(source) {
	this.source = source;

	this.functions = {};
	this.stack = [];
	this.callstack = [];
	this.pc = 0;

	var parser = new Parser();
	this.tokens = parser.parse(this.source);
}

window.Runtime.prototype.step = function() {
	if(this.pc == null || this.pc >= this.tokens.length)
		return false;

	var token = this.tokens[this.pc];

	if(token.literal) {
		this.stack.push(token.value);
	}

	else if(token.type == 'func')
	{
		// If it's a function definition.
		if(token.value == '{') {
			// Generate an anonymous JS function that we can call to call the function
			var targetPc = this.pc;

			var fnCaller = function() {
				this.callstack.push(this.pc);
				this.pc = targetPc;
			}

			fnCaller.toJSON = function() { return "<func>"; }

			// Jump to the closing parenthesis.
			var searchToken;
			var level = 0;
			while (true) {
				searchToken = this.tokens[this.pc];
				if(searchToken.value === '{') {
					level++;
				} else if(searchToken.value === '}') {
					level--;
					if (level === 0) {
						break;
					}
				}
				this.pc++;
			}

			this.stack.push(fnCaller);
		}

		// If we're returning from a function
		else if(token.value == '}') {
			this.pc = this.callstack.pop();
		}
	}

	else {
		this.callFunction(token.value);
	}

	this.pc++;

	return true;
}

window.Runtime.prototype.run = function() {
	while(this.step()) {}
	return this.stack;
};

window.Runtime.prototype.registerFunction = function(name, fn) {
	this.functions[name] = fn;
};

window.Runtime.prototype.callFunction = function(fn) {
	if(typeof fn === "string") {
		const resolved = this.functions[fn] ?? window.StdLib[fn];
		if (!resolved) {
			throw new Error(`Unknown function ${fn}`);
		}
		fn = resolved;
	}

	if(typeof fn === "function") {
		fn.apply(this);
	}
	else {
		throw new Error(`Unknown function ${fn}`);
	}
};
