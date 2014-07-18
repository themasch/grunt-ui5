/*
 * grunt-ui5
 * https://github.com/themasch/grunt-ui5
 *
 * Copyright (c) 2014 Mark Schmale
 * Licensed under the MIT license.
 */

'use strict';

var uglify = require('uglify-js'),
    maxmin = require('maxmin');


function combinePreload(basePath, name, config, grunt) {
    var path = name.replace(/\./g, '/');
    var fullPath = './' + basePath + '/' + path + '/';
    var files = grunt.file.expand({ matchBase: true, cwd: fullPath }, [ '*.js', '*.view.*', '!component-preload.js' ]);

    var modules = {};

    files.map(function(name) {
        var filePath = (path + '/' + name).replace(/\/{2,}/g, '/');
        var content;
        var raw = content = grunt.file.read(fullPath + name);
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
            content = grunt.file.read(fullPath + name);
        }

        grunt.verbose.writeln(filePath + ': ', maxmin(raw, content, true));

        modules[filePath] = content;
    });

    return modules;
}

function createPreloadFile(grunt, libs, postfix, wrapper, resultName, config) {
    return libs.map(function(libdef) {
        var modules = combinePreload(libdef.basePath, libdef.name, config, grunt);

        var jsonData = {
            version: libdef.version || "2.0.1",     // version >= 2.0.0 because sapui breaks filename for version < 2.0.0
            name: libdef.name + postfix,
            modules: modules
        };

        var sources  = wrapper.replace('JSON_CONTENT', JSON.stringify(jsonData));

        var path = libdef.name.replace(/\./g, '/');
        var fullPath = './' + libdef.basePath + '/' + path + '/';

        grunt.file.write(fullPath + resultName, sources);
        grunt.log.writeln('updated/created ' +libdef.name + postfix)
    })
}


module.exports = function(grunt) {

    grunt.registerMultiTask('ui5-component-preload', 'Generate a component-preload.js file for UI5 Components.', function() {

        var options = {
            components: this.data.components || [],
            config: this.options({ minify: true, preserveComments: false })
        };

        var libs = options.components;
        var modPostfix = '.Component-preload';
        var wrap =  'jQuery.sap.registerPreloadedModules(JSON_CONTENT)';
        var fileName = 'component-preload.js';
        createPreloadFile(grunt, libs, modPostfix, wrap, fileName, options.config);

    });

    grunt.registerMultiTask('ui5-library-preload', 'Generate a library-preload.js file for UI5 Components.', function() {

        var options = {
            libraries: this.data.libraries || [],
            config: this.options({ minify: true, preserveComments: false })
        };

        var libs = options.libraries;
        var modPostfix = '.library-preload';
        var wrap =  'JSON_CONTENT';
        var fileName = 'library-preload.json';
        createPreloadFile(grunt, libs, modPostfix, wrap, fileName, options.config);

    });

};
