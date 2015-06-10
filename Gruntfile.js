module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
    },

    jshint: {
      files: [
        // Add filespec list here
        ],
        options: {
          force: 'true',
          jshintrc: '.jshintrc',
          ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js'
          ]
        }
      },

      cssmin: {
      },

      watch: {
        scripts: {
          files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
          ],
          tasks: [
          'concat',
          'uglify'
          ]
        },
        css: {
          files: 'public/*.css',
          tasks: ['cssmin']
        }
      },

      shell: {
        prodServer: {
        }
      },

      copy: {
        build: {
        //not sure about config options, "source" is dir files are relative to
        cwd: '../shortly-deploy',
        src: [ '**/*' , '!**/node_modules/**'],
        dest: 'build',
        expand: true
      },
    },

    clean: {
      build: {
        src: [ 'build' ]
      }
    },
  });

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-mocha-test');
grunt.loadNpmTasks('grunt-shell');
grunt.loadNpmTasks('grunt-nodemon');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-clean');

grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
     cmd: 'grunt',
     grunt: true,
     args: 'nodemon'
   });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
    ]);

  grunt.registerTask('build', [
    ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'test',
    'build',
    'upload'
    ]);


};
