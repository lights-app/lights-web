var gulp = require('gulp')
var jade = require('gulp-jade')
var less = require('gulp-less')
var csso = require('gulp-csso')
var plumber = require('gulp-plumber')
var argv = require('yargs').argv
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var gls = require('gulp-live-server')
var babel = require('gulp-babel')
var autoprefixer = require('gulp-autoprefixer')
var server

gulp.task('jade', function() {
	
	var stream = gulp.src('./jade/index.jade')
		.pipe(plumber({
			errorHandler: function (err) {
				console.warn(err)
				this.emit('end')
			}
		}))
		.pipe(jade({}))
		.pipe(gulp.dest('./build'))
		
	if (server) stream = stream.pipe(server.notify())

	return stream

})

gulp.task('js', function() {
	
	var stream = gulp.src('./js/**/*.js')
		.pipe(plumber({
			errorHandler: function (err) {
				console.warn(err)
				this.emit('end')
			}
		}))
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		/*.pipe(babel({
			presets: ['es2015']
		}))*/
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/static/js'))
		
	if (argv.publish) {
		
		stream = stream.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('./static/js'))
			.pipe(gulp.dest('./build/static/js'))
			
	}
	
	if (server) stream = stream.pipe(server.notify())
	
	return stream

})

gulp.task('less', function() {
	
	var stream = gulp.src('./less/app.less')
		.pipe(sourcemaps.init())
		.pipe(plumber({
			errorHandler: function (err) {
				
				console.warn(err)
				this.emit('end')
				
			}
		}))
		
		.pipe(less())
		.pipe(autoprefixer({
			options: {
				browsers: ['last 2 versions', 'chrome', 'safari', 'ios']
			}
			
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/static/css'))

	if (argv.publish) {
		
		stream = stream.pipe(csso(true))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('./build/static/css'))
	}
	
	if (server) stream = stream.pipe(server.notify())
	
	return stream
	
})

gulp.task('vendor', function() {
	
	var stream = gulp.src(['./vendor/lars/lrs.js', './vendor/particle-api-js/dist/particle.min.js', './vendor/suncalc/suncalc.js'])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./build/static/js'))
		
	if (argv.publish) {
		
		stream = stream.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('./static/js'))
			.pipe(gulp.dest('./build/static/js'))
			
	}
	
	return stream
	
})

gulp.task('default', ['vendor', 'js', 'less', 'jade'])

gulp.task('dev', function() {
	
	server = gls.static('build')
	server.start()
	
	gulp.watch('vendor/**/*', ['vendor'])
	gulp.watch('jade/**/*', ['jade'])
	gulp.watch('less/**/*', ['less'])
	gulp.watch('js/**/*', ['js'])
	
	
})

gulp.task('test-page', function() {
	
	server = gls.static('simple-test-page')
	server.start()

	gulp.watch('simple-test-page/**/*', function(file) {

		server.notify.apply(server, [file])

	})
	
})