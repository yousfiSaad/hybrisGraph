const fs = require('fs'),
    xml2js = require('xml2js');
 
const parser = new xml2js.Parser();

module.exports = function getInfos(xmlFile){
    if(xmlFile instanceof Array){
        return Promise.all(xmlFile.map(getInfos));
    }
    return new Promise(function(res, rej){
        fs.readFile(xmlFile, function(err, data){
            parser.parseString(data, function(err, results){
                try {
                   let requires = results.extensioninfo.extension[0]['requires-extension'] || [];
                    res({
                        name : results.extensioninfo.extension[0].$.name,
                        path : xmlFile,
                        requires : requires.map(function(r){
                            return r.$.name;
                        })
                    })
                } catch (error) {
                    console.error("error : ", xmlFile, error);
                    // console.error(JSON.stringify(results.extensioninfo.extension.$, null, 2));
                    rej({error})
                }
            });
        });
    });
}

