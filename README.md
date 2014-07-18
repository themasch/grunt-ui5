# grunt-ui5

> Tasks around the OpenUI5/SAPUI5 framework.

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

## The "ui5" task

### Overview
In your project's Gruntfile, add a section named `ui5` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    "ui5-component-preload": {
        default: {
            options: {
            },
            components: [
            ]
        }
    },
    "ui5-library-preload": {
        default: {
            options: {
            },
            libraries: [
            ]
        }
    },
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
    "ui5-component-preload": {
        default: {
            components: [
                {
                    basePath: "public/",
                    name: "our.pretty.uicomponent"
                }
            ]
        }
    },
    "ui5-library-preload": {
        default: {
            options: {
                minify: true, 
                preserveComments: true,  // default false
            },
            libraries: [
                {
                    basePath: "public/",
                    name: "my.cool.library",
                    version: "3.4.5" // default 2.0.1
                },
                {
                    basePath: "public/",
                    name: "my.cooler.control",
                    version: "4.2.0" // default 2.0.1
                }
            ]
        }
    },
});
```



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 - 0.1.0 initial release. 
 
## TODO

 - unit tests 
 - merge preload tasks into one clever task that recognizes if its a component or a library and generates the correct output. 
   Both results are pretty similar. Should be possible to do this. 
