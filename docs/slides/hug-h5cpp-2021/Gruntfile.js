/* global module:false */
module.exports = function(grunt) {
	var port = grunt.option('port') || 8000;
	var root = grunt.option('root') || '.';

	if (!Array.isArray(root)) root = [root];

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' */'
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n',
				screwIE8: false
			},
			build: {
				src: 'js/reveal.js',
				dest: 'js/reveal.min.js'
			}
		},

		sass: {
			core: {
				src: 'css/reveal.scss',
				dest: 'css/reveal.css'
			},
			themes: {
				expand: true,
				cwd: 'css/theme/source',
				src: ['*.sass', '*.scss'],
				dest: 'css/theme',
				ext: '.css'
			}
		},

		autoprefixer: {
			core: {
				src: 'css/reveal.css'
			}
		},

		cssmin: {
			options: {
				compatibility: 'ie9'
			},
			compress: {
				src: 'css/reveal.css',
				dest: 'css/reveal.min.css'
			}
		},

		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				esnext: true,
				latedef: 'nofunc',
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false,
					unescape: false,
					define: false,
					exports: false
				}
			},
			files: [ 'Gruntfile.js', 'js/reveal.js' ]
		},

		connect: {
			server: {
				options: {
					port: port,
					base: root,
					livereload: true,
					open: true,
					useAvailablePort: true
				}
			}
		},

		zip: {
			bundle: {
				src: [
					'index.html',
					'css/**',
					'js/**',
					'lib/**',
					'pix/**',
					'images/**',
					'plugin/**',
					'**.md'
				],
				dest: 'cppto.zip'
			}
		},

		watch: {
			js: {
				files: [ 'Gruntfile.js', 'js/reveal.js' ],
				tasks: 'js'
			},
			theme: {
				files: [
					'css/theme/source/*.sass',
					'css/theme/source/*.scss',
					'css/theme/template/*.sass',
					'css/theme/template/*.scss'
				],
				tasks: 'css-themes'
			},
			css: {
				files: [ 'css/reveal.scss' ],
				tasks: 'css-core'
			},
			html: {
				files: ['site/h5cpp/*.html','site/*.html'],
				tasks: 'includes'
			},
			markdown: {
				files: root.map(path => path + '/*.md')
			},
			options: {
				livereload: true
			}
		},
	  	clean: {
		  build: ['build/']
		},
		retire: {
			js: [ 'js/reveal.js', 'lib/js/*.js', 'plugin/**/*.js' ],
			node: [ '.' ]
		},

		includes: {
		  build: {
			cwd: 'site',
			src: [ 'index.html' ],
			dest: '.',
			options: {
			  banner: '<!-- h5cpp.org -->\n'
			}
		  }
		}
	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-connect' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-retire' );
	grunt.loadNpmTasks( 'grunt-sass' );
	grunt.loadNpmTasks( 'grunt-zip' );
  	grunt.loadNpmTasks( 'grunt-contrib-clean');
	grunt.loadNpmTasks( 'grunt-includes');

	grunt.registerTask( 'build', ['clean', 'includes']);
	grunt.registerTask( 'default', [ 'css', 'js', 'build' ] );
	grunt.registerTask( 'js', [ 'jshint', 'uglify' ] );
	grunt.registerTask( 'css-themes', [ 'sass:themes' ] );
	grunt.registerTask( 'css-core', [ 'sass:core', 'autoprefixer', 'cssmin' ] );
	grunt.registerTask( 'css', [ 'sass', 'autoprefixer', 'cssmin' ] );
	grunt.registerTask( 'package', [ 'default', 'zip' ] );
	grunt.registerTask( 'serve', [ 'connect','watch','build' ] );

};
