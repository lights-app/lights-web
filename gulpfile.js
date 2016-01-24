var gulp = require('gulp')
var jade = require('gulp-jade')
var less = require('gulp-less')
var csso = require('gulp-csso')
var plumber = require('gulp-plumber')
var argv = require('yargs').argv
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var gls = require('gulp-live-server')
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
		
	stream = stream.pipe(server.notify())

	return stream

})

gulp.task('js', function() {
	
	var stream = gulp.src('./js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/static/js'))
		
	if (argv.publish) {
		
		stream = stream.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('./static/js'))
			.pipe(gulp.dest('./build/static/js'))
			
	}
	
	stream = stream.pipe(server.notify())
	
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
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./build/static/css'))

	if (argv.publish) {
		
		stream = stream.pipe(csso(true))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('./build/static/css'))
	}
	
	stream = stream.pipe(server.notify())
	
	return stream
	
})

gulp.task('vendor', function() {
	
	var stream = gulp.src(['./vendor/lars/lrs.js'])
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('./build/static/js'))
		
	if (argv.publish) {
		
		stream = stream.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('./static/js'))
			.pipe(gulp.dest('./build/static/js'))
			
	}
	
	return stream
	
})

gulp.task('dev', function() {
	
	server = gls.static('build')
	server.start()
	
	gulp.watch('jade/**/*', ['jade'])
	gulp.watch('less/**/*', ['less'])
	gulp.watch('js/**/*', ['js'])
	
	
})