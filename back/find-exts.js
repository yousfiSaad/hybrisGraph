const { resolve } = require('path');
const fs = require('fs');


var findFileInDir = function(filename, dire, depth){
    const isDir = function(arg){
        try {
            return fs.statSync(arg).isDirectory();
        } catch (error) {
            return false;
        }
    };
    if(depth === 0){
        return [];
    }
    let results = [];
    let contentNames = fs.readdirSync(dire);
    for (var i = 0; i < contentNames.length; i++) {
        var contentName = contentNames[i];
        let fileordir = resolve(dire, contentName);
        if(isDir(fileordir)){
            results = results.concat(findFileInDir(filename, fileordir, depth - 1));
        }else{
            if(contentName === filename){
                results.push(fileordir);
            }
        }
    }
    return results;
};



module.exports = findFileInDir;

