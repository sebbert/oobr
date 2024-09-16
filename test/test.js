$(function() {
    var runtime;

    function setActive(active)
    {
        if(active)
        {
            $("#run_btn,#step_btn,#reset_btn").removeAttr("disabled");
        }
        else
        {
            $("#run_btn,#step_btn,#reset_btn").attr("disabled", "");
        }
    }

	function saveCode(code) {
		localStorage.code = code
	}

	function loadCode() {
		return localStorage.code || '"sq" { dup * } def 2 sq';
	}

    function log(msg)
    {
        var logelem = $("#log_output");
        var logtext = logelem.text();
        logelem.text(msg + "\n" + logtext);
    }

    function setOutput(str)
    {
        $("#output").text(str);
    }

    function formatOutput({ finished } = {}) {
        var out = "";
        out += "Current stack = " + JSON.stringify(runtime.stack) + "\n";
        out += "Callstack     = " + JSON.stringify(runtime.callstack) + "\n";
        out += "PC            = " + runtime.pc + "\n";
        out += "Next token    = " + JSON.stringify(runtime.tokens[runtime.pc]) + "\n";
        out += "Functions     = " + JSON.stringify(Object.keys(runtime.functions)) + "\n";
        if(finished) out += "\nProgram finished.";

        return out;
    }

    function updateOutput(args = {}) {
        return setOutput(formatOutput(args))
    }

	$("#code_input").val(loadCode());

    $("#compile_btn").click(function() {
        var code = $("#code_input").val();

		saveCode(code);

        try {
            runtime = new Runtime(code);

            log("Compiled successfully into " + runtime.tokens.length + " tokens: " + JSON.stringify(runtime.tokens, undefined, 4));
            updateOutput()

            setActive(true);
        }

        catch(e) {
            log("Compilation error: " + e.msg);
            setActive(false);
        }
    });

    $("#run_btn").click(function() {
        var result = runtime.run();
        updateOutput({ finished: true });
    });

    $("#step_btn").click(function() {
        var result = runtime.step();

        updateOutput({ finished: !result });
    });

    $("#reset_btn").click(function() {
        log("   ------------------------------   ")
        $("#output").text("");

        runtime = null;

        setActive(false);
    });
});
