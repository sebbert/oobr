// Terrible parser for now, but it works

window.Parser = function(source) {}

window.Parser.prototype.parse = function(source) {
	// Fuckin regex...
	var rx = /(?:([\d.]+)|(([\"'])(.+?)\3)|([\w\.\+\-\*\/<>=%]+)|([{}]))/igm;
	var match;
	var tokens = [];

	while((match = rx.exec(source)) != null) {

		console.log(match);
		// Ok, here goes. Basically what we need to do is decide what type
		// of token each match is based on what the capture groups return.
		// Sadly, javascript doesn't support named capture groups :(

		// String literals
		if(!!match[3])
		{
			var token = {
				type: 'string',
				value: match[4],
				literal: true
			};

			tokens.push(token);
		}

		// Number literals
		else if(!!match[1])
		{
			var val = parseFloat(match[1]);
			if(isNaN(val))
			{
				throw new Error("Invalid number literal");
				return null;
			}

			var token = {
				type: 'number',
				value: val,
				literal: true
			};

			tokens.push(token);
		}

		// Anonymous functions: { and }
		else if(!!match[6])
		{
			var token = {
				type: 'func',
				value: match[0],
				literal: false
			};

			tokens.push(token);
		}

		// Function calls
		else
		{
			var token = {
				type: 'call',
				value: match[0],
				literal: false
			}

			tokens.push(token);
		}
	}

	return tokens;
};
