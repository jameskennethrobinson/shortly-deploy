module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        seperator: ';'
      },
      dist: {
        src: ['public/client/**/*.js', 'public/client/**/*.js'],
        dest: 'build/application.js'
      }
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
      build: {
        options: {
          mangle: false
        },
        files: {
          'build/application.js': [ 'build/**/*.js' ]
        }
      }
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
      build: {
        files: {
          'build/application.css': [ 'build/**/*.css' ]
        }
      }
    },

    watch: {
      options: { interval: 5007 },
      scripts: {
        files: ['public/client/**/*.js',
                'public/lib/**/*.js'],
        tasks: ['testTask']
      },
      css: {
        files: 'public/*.css',
        tasks: ['testTask']
      },
      copy: {
        files: ['../shortly-deploy/**', '!**/build/**', '!**/node_modules/**', '!public/client/**/*.js','!public/lib/**/*.js','!public/*.css'],
        tasks: ['copy']
      }
    },

    shell: {
      prodServer: {
      }
    },

    copy: {
      build: {
        cwd: '../shortly-deploy',
        src: [ '**/*' , '!**/node_modules/**'],
        dest: 'build',
        expand: true
      }
    },

    clean: {
      build: {
        src: [ 'build' ]
      },
      stylesheets: {
        src: [ 'build/**/*.css', '!build/application.css' ]
      },
      scripts: {
        src: [ 'build/**/*.js', '!build/application.js' ]
      }
    }
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

  grunt.registerTask('tasktest',
    ['']);

  grunt.registerTask('test',
    ['mochaTest']);

  grunt.registerTask('scripts',
    'Compiles the Javascript files.',
    ['uglify', 'clean:scripts']);

  grunt.registerTask('stylesheets',
    'Compiles the stylesheets.',
    ['cssmin', 'clean:stylesheets' ]);

  grunt.registerTask('build',
    'Compiles all of the assets and copies the files to the build directory.',
    ['clean:build', 'copy', 'stylesheets', 'scripts']);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy',
    ['test', 'build', 'upload']);

  grunt.registerTask('default',
    'Watched the project for changes and automatically builds them.',
    ['build', 'watch']);
};
