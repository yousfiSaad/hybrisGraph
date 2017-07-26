const findExts = require('./find-exts');
const getInfos = require('./ext-infos');
const skipo    = require('./skipo');
const { resolve } = require('path');


const EXTENSIONINFO = "extensioninfo.xml"
const LOCALEXTSRELPATH = 'hybris\\config\\localextensions.xml';

const dire = "Y:\\w";

module.exports = function scan(arrExtsXml){
    const localExtsXmlPath = resolve(arrExtsXml, LOCALEXTSRELPATH);
    
    let json = findExts(EXTENSIONINFO, arrExtsXml, 5);
    return getInfos(json)
        .then((deps)=>skipo(deps, localExtsXmlPath));
};
