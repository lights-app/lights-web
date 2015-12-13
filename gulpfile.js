var gulp = require('gulp')
var less = require('gulp-less')
var csso = require('gulp-csso')
var plumber = require('gulp-plumber')
var argv = require('yargs').argv
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var server = require('gulp-express')

gulp.task('html', function() {

	var stream = gulp.src('./index.html')
		.pipe(gulp.dest('./build'))

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

gulp.task('css', function() {
	
	var stream = gulp.src('./css/app.less')
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
	
	server.run(['server.js'])
	
	gulp.watch('css/**/*', ['css'])
	gulp.watch('js/**/*', ['js'])
	
	
})