const fs = require('fs');
const xml2js = require('xml2js');
 
const parser = new xml2js.Parser();


const skipi = function (xmlFile){
    return new Promise(function(res, rej){
        fs.readFile(xmlFile, function(err, data){
            parser.parseString(data, function(err, results){
                try {
                   const exts = results.hybrisconfig.extensions[0].extension.map(function(ex){
                       return ex.$.name.toLowerCase();
                   });
                   res(exts);
                } catch (error) {
                    console.error("error : ", xmlFile, error);
                    rej({error})
                }
            });
        });
    });
}

const skipo = function(json, LOCALEXT){
    return skipi(LOCALEXT).then(function(notSkip){
        json.forEach(function(element) {
            if(notSkip.indexOf(element.name) === -1){
                element.skip = true;
            }
        }, this);
        return json;
    });
}


module.exports = skipo;