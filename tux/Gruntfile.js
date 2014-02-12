module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
                files: ['src/api/**.json', 'src/**.htm', 'src/parts/**.htm', 'src/api/dicts/**.json', 'src/api/parts/**.json'],
                tasks: ['includes']
            },
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['includes']);
};