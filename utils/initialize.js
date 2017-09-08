var fs = require('fs');
var path =  require('path');
var exports = module.exports = {};
var initialize = function(){
    arryCreateFolder('./',['app','dev']);
    arryCreateFolder('./app',['prod']);
};

function arryCreateFolder(imgFolder, folderArr){
    var nFolder = imgFolder;
    for( folder in folderArr ){
        var status = searchFolder(nFolder, folderArr[folder]);
        if(!status){
            var createStatus = createFolder(nFolder, folderArr[folder]);
            nFolder = path.join(nFolder, folderArr[folder]);
        }
    }
}

function createFolder(folder, createFolder){
    var tgFolder = path.join(folder,createFolder);
    console.log("createFolder ==> " + tgFolder);
    fs.mkdir(tgFolder, 0777, function(err){
        return !err;
    });
}

function searchFolder(folder, srhFolder){
    var rtnFolder;
    fs.readdir(folder, function (err, files) {
        if(err) {
            throw err;
        }
        files.forEach(function(file){
            if(file == srhFolder){
                fs.stat(path.join(folder, file), function(err, stats){
                    if(stats.isDirectory()){
                        return path.join(folder, file);
                    }
                });
            }
        });
    });
    return false;
}
exports.initialize = initialize();