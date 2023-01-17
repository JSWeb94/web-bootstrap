module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });
    grunt.initConfig({
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            files: ['css/*.scss'],
            tasks: ['css']
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'css/*.css',
                        '*.html',
                        'js/*.js'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './'
                    }
                }
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['images/*.{png,jpg,gif}'],
                    dest: 'dist/images/'
                }]
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: './', src: ['*.html'], dest: 'dist/' },
                    { expand: true, cwd: './', src: ['js/*.js'], dest: 'dist/js' },
                    { expand: true, cwd: './', src: ['css/*.css'], dest: 'dist/css' }],
            },
            font:{
                expand: true,
                dot: true,
                cwd: 'node_modules/open-iconic/font',
                src: ['fonts/*.*'],
                dest: 'dist'
            }
        },
        clean: {
            build: {
                src: ['dist/']
            }
        },
        cssmin: {
            dist: {}
        },
        uglify: {
            dist: {}
        },
        filerev: {
            options: {
                encoding: 'uft8',
                algorithm: 'md5',
                length: 20
            },
            files: {
                src: ['dist/css/*.css', 'dist/js/*.js']
            }
        },
        release: {
            files: [{
                src: [
                    'dist/js/*.js',
                    'dist/css/*.css'
                ]
            }]
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {}
        },
        useminPrepare: {
            foo: {
                dest: 'dist',
                src: ['index.html', 'nosotros.html', 'precios.html', 'terminosycondiciones.html', 'contactos.html']
            },
            options: {
                flow: {
                    steps: {
                        css: ['cssmin'],
                        js: ['uglify']
                    },
                    post: {
                        css: [{
                            name: 'cssmin',
                            createConfig: function (context, block) {
                                var generated = context.options.generated;
                                generated.options = {
                                    keepSpecialComments: 0,
                                    rebase: false
                                }
                            }
                        }]
                    }
                }
            }
        },
        usemin : {
            html: ['dist/index.html', 'dist/nosotros.html', 'dist/precios.html', 'dist/terminosycondiciones.html', 'dist/contactos.html'],
            options: {
                assetsDir: ['dist', 'dist/css', 'dist/js']
            }
        }
    });

grunt.registerTask('css', ['sass']);
grunt.registerTask('default', ['browserSync', 'watch']);
grunt.registerTask('build', [
	'clean', //Borramos el contenido de dist
'copy', //Copiamos los archivos html a dist
'imagemin', //Optimizamos imagenes y las copiamos a dist
'useminPrepare', //Preparamos la configuracion de usemin
'concat',
'cssmin',
'uglify',
'filerev', //Agregamos cadena aleatoria
'usemin' //Reemplazamos las referencias por los archivos generados por filerev
]);
};