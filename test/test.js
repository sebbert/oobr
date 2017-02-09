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

	$("#code_input").val(loadCode());

    $("#compile_btn").click(function() {
        var code = $("#code_input").val();

		saveCode(code);


        try {
            runtime = new Runtime(code);

            log("Compiled successfully into " + runtime.tokens.length + " tokens.");
            setActive(true);
        }

        catch(e) {
            log("Compilation error: " + e.msg);
            setActive(false);
        }
    });

    $("#run_btn").click(function() {
        var result = runtime.run();
        setOutput("Program finished with stack: " + JSON.stringify(result));
    });

    $("#step_btn").click(function() {
        var result = runtime.step();
        var out = "";

        function tokenStr(t) {
            if(t.type == 'string')
                return '"' + t.value + '"';
            else return t.value;
        }

        out += "Current stack = " + JSON.stringify(runtime.stack) + "\n";
        out += "Callstack     = " + JSON.stringify(runtime.callstack) + "\n";
        out += "PC            = " + runtime.pc + "\n";
        if(!result) out += "\nProgram finished.";

        setOutput(out);
    });

    $("#reset_btn").click(function() {
        log("   ------------------------------   ")
        $("#output").text("");

        runtime = null;

        setActive(false);
    });
});
