module.exports = function (grunt) {
    grunt.initConfig({
        jasmine_nodejs: {
            options: {
                specNameSuffix: "spec.js",
                stopOnFailure: false,
                reporters: {
                    console: {
                        colors: true,
                        cleanStack: 1,
                        verbosity: 3,
                        listStyle: "indent"
                    }
                }
            },
            all: {
                specs: [
                    "spec/*.spec.js"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-jasmine-nodejs");

    grunt.registerTask("default", ["jasmine_nodejs"]);
};
