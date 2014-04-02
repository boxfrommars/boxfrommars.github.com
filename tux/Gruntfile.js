module.exports = function(grunt) {
    var vendorJsFiles = [
        'public/assets/vendor/jquery/jquery.js',
    ];


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    targetDir: './assets/vendor',
                        layout: 'byType',
                        install: true,
                        verbose: false,
                        cleanTargetDir: true,
                        cleanBowerDir: false,
                        bowerOptions: {}
                }
            }
        },
        includes: {
            build: {
                cwd: 'src',
                src: [ '**.htm'],
                dest: '.',
                options: {
                    flatten: true,
                    includePath: 'src'
                }
            }
        },
        watch: {
            html: {
                files: ['src/api/**.json', 'src/**.htm', 'src/parts/**.htm', 'src/api/dicts/**.json', 'src/api/parts/**.json', 'src/websocket-api/**.json', 'src/schemas/**.json'],
                tasks: ['includes']
            },
            options: {
                livereload: {
                    port: 9000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['includes', 'bower']);
};