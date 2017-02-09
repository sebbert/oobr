window.Context = function() {
	this.functions = {};
	this.stack = [];
};

window.Context.prototype.register = function(name, fn) {
	this.functions[name] = fn;
};

window.Context.prototype.callFunction = function(name) {
	if(!(name in this.functions))
	{
		throw new Error("Function '" + name + "' is not registered with the current context.");
	}
	this.functions[name].apply(this);
};
