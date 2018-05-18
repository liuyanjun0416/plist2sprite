// var parseString = require("xml2js").parseString;
const parser = require("xml-parser");

function walk(node) {
  if (node.name === "dict") {
    let ret = {};
    for (var i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      i++;
      const child2 = node.children[i];

      if(child.content === "offset"){
        ret["trimmed"] = checkOffset(child2.content);
      }else if(child.content === "sourceColorRect"){
        ret["spriteSourceSize"] = walk(child2);
      }else{
        ret[child.content] = walk(child2);
      }
    }
    return ret;
  } else if (node.name === "plist") {
    return walk(node.children[0]);
  } else if (node.name === "string") {
    return getPositionAndSize(node.content);
  } else if (node.name === "integer") {
    return parseInt(node.content);
  } else if (node.name === "false") {
    return false;
  } else {
    console.log("unknown", node);
  }
}

function parse(xml) {
  const doc = parser(
    xml.replace(
      '<!DOCTYPE plist PUBLIC "-//Apple Computer//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      ""
    )
  );
  const ret = rewriteMeta(walk(doc.root));
  return ret;
}

function rewriteMeta(doc){
    doc.meta = {
      image:doc.metadata.realTextureFileName,
      size:doc.metadata.size,
      scale:1
    }
    delete doc.metadata;
    return doc;
}

function checkOffset(string){
  let matchArr = string.match(/{(-?\d+),(-?\d+)}/);
  if(parseInt(matchArr[1]) === 0 && parseInt(matchArr[2] === 0)){
    return false;
  }
  return true;
}

function getPositionAndSize(string){
  let regexGlobal = /{(-?\d+),(-?\d+)}/g
  let regex = /{(-?\d+),(-?\d+)}/
  let matchArr = string.match(regexGlobal);
  let result = {};
  if(!matchArr){
    return string;
  }
  if(matchArr.length === 2){
    let position = matchArr[0].match(regex);
    let size = matchArr[1].match(regex);
    result.x = parseInt(position[1]);
    result.y = parseInt(position[2]);
    result.w = parseInt(size[1]);
    result.h = parseInt(size[2]);
  }else{
    let size = string.match(regex);
    result.w = parseInt(size[1]);
    result.h = parseInt(size[2]);
  }
  return result;
}
module.exports = {
  parse
};
