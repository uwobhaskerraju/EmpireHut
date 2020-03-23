    function debugLine(message) {
        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let fileName = frame.split(":")[1];
        fileName = fileName.split("\\")[fileName.split("\\").length - 1];
        let lineNumber = frame.split(":")[2];
        let functionName = frame.split(" ")[5];
        return functionName + "||" + fileName + "||" + lineNumber + "||" + message;
    }
    function generateReq(req){
        let jsonCmbd = '';
        if(typeof(req.app.locals)!="undefined"){
            if (Object.keys(req.app.locals).length > 1) {
                delete req.app.locals.settings
                const entries = Object.keys(req.app.locals)
              
                for (let index = 0; index < entries.length; index++) {
                    jsonCmbd = jsonCmbd.concat("{" + entries[index] + ":" + Object.values(req.app.locals)[index] + "}")
                }
    
            }
        }
        if(typeof(req.body)!="undefined"){
                const entries = Object.keys(req.body)      
                for (let index = 0; index < entries.length; index++) {
                    jsonCmbd = jsonCmbd.concat("{" + entries[index] + ":" + Object.values(req.body)[index] + "}")
                }
        }
        return jsonCmbd
    }


module.exports = {
    debugLine: debugLine,
    generateReq: generateReq,

};