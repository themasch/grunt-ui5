/*
 * grunt-ui5
 * https://github.com/themasch/grunt-ui5
 *
 * Copyright (c) 2014 UNIORG Solutions GmbH
 * Licensed under the MIT license.
 */

'use strict';

var uglify = require('uglify-js'),
    maxmin = require('maxmin');


function ui5grunt(grunt) {
    this.g = grunt;
}

ui5grunt.prototype.compressFile = function(path, fullPath, config, modules, name) {
    var filePath = (path + '/' + name).replace(/\/{2,}/g, '/');
    var content;
    var raw = content = this.g.file.read(fullPath + name);
    if(config.minify && name.match(/xml$/)) {
        content = config.preserveComments
            ? content
            : content.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"");
        content = content.replace(/>\s*</g, '><')
        content = config.relentlessXml
            ? content.replace(/\s+/g, '')
            : content
    }
    else if(config.minify && name.match(/js$/)) {
        content = uglify.minify(fullPath + name).code;
    }
    else {
        content = this.g.file.read(fullPath + name);
    }

    this.g.verbose.writeln(filePath + ': ', maxmin(raw, content, true));

    modules[filePath] = content;
};

ui5grunt.prototype.combinePreload = function(basePath, libName, config, grunt) {
    var path = libName.replace(/\./g, '/');
    var fullPath = './' + basePath + '/' + path + '/';
    var files = this.g.file.expand({ matchBase: true, cwd: fullPath }, [ '*.js', '*.view.*', '!component-preload.js' ]);

    var modules = {};

    files.map(compressFile.bind(this, path, fullPath, config, modules));

    return modules;
};

ui5grunt.prototype.getLibraryInfo = function(fullPath) {
    var files = this.g.file.expand({ matchBase: true, cwd: fullPath }, [ 'library.js', 'Component.js' ]);

    if(files.length > 1) {
        this.g.log.writeln("we found more then one library definition: ", files);
        return;
    }

    if(files.length === 0) {
        this.g.log.writeln("we found no library definition: ", files);
        return;
    }

    //todo: read dependencies from library.js/component.js

    var isComponent = files[0] === 'Component.js';

    return isComponent ? {
        type: 'component',
        postfix: '.Component-preload',
        wrap: 'jQuery.sap.registerPreloadedModules(JSON_CONTENT);',
        filename: 'component-preload.js'
    } : {
        type: 'library',
        postfix: '.library-preload',
        wrap: 'JSON_CONTENT',
        filename: 'library-preload.json'
    };

};

ui5grunt.prototype.createPreloadFile = function(config, libdef)  {

    var path = libdef.name.replace(/\./g, '/');
    var fullPath = './' + libdef.basePath + '/' + path + '/';

    var info    = this.getLibraryInfo(fullPath);
    if(!info) {
        return;
    }
    var modules = this.combinePreload(libdef.basePath, libdef.name, config);

    var jsonData = {
        version: libdef.version || "2.0",     // version >= 2.0.0 because sapui breaks filename for version < 2.0.0
        name: libdef.name + info.postfix,
        modules: modules
    };

    var sources  = info.wrap.replace('JSON_CONTENT', JSON.stringify(jsonData));

    this.g.file.write(fullPath + info.filename, sources);
    this.g.log.writeln('updated/created ' +libdef.name + info.postfix)
};

module.exports = function(grunt) {

    var ui5 = new ui5grunt(grunt);

    grunt.registerMultiTask('ui5preload', 'Generates *-preload.js files for UI5 Components and libraries.', function() {
        var config = this.options({ minify: true, preserveComments: false });
        this.data.paths.map(ui5.createPreloadFile.bind(ui5, config));
    });

};
