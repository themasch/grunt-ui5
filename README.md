# grunt-ui5

> Tasks around the [OpenUI5](https://github.com/sap/openui5)/SAPUI5 framework.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ui5 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ui5');
```

## The "ui5" tasks

### Overview
In your project's Gruntfile, add a section named `ui5preload` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    ui5preload: {
        default: {
            options: {
            },
            paths: [
            ]
        }
    }
});
```

### Options

#### options.minify
Type: `boolean`
Default value: `true`

A flag that is used to decide if source files should be minified (recommended!)

#### options.preserveComments
Type: `boolean`
Default value: `false`

A flag to decide if comments should be preserved in XML files. 

### Usage Examples

```js
grunt.initConfig({
    ui5preload: {
        default: {
            options: {
                minify: true, 
                preserveComments: true,  // default false
            },
            paths: [
                {
                    basePath: "public/",
                    name: "our.pretty.uicomponent"
                },
                {
                    basePath: "public/",
                    name: "my.cool.library"
                },
                {
                    basePath: "public/",
                    name: "my.cooler.control"
                }
            ]
        }
    },
});
```



## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 - 0.2.0 improved configuration by automatic library type detection
 - 0.1.0 initial release. 
 
 
## TODO

 - unit tests 
 - source maps
 - include additional directories/files (like sap.ui.core does)
