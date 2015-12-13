var gulp = require('gulp')
var less = require('gulp-less')
var csso = require('gulp-csso')
var plumber = require('gulp-plumber')
var argv = require('yargs').argv

gulp.task('js', function() {

})

gulp.task('css', function() {
	
	var stream = gulp.src('./css/app.less')
		.pipe(plumber({
			errorHandler: function (err) {
				
				console.warn(err)
				this.emit('end')
				
			}
		}))
		.pipe(less())
		.pipe(gulp.dest('./build/static/css'))

	if (argv.publish) {
		
		stream = stream.pipe(csso(true))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('./build/static/css'))
	}
	
	return stream
	
})

gulp.task('vendor', function() {

})

gulp.task('watch', ['js', 'css', 'vendor'], function() {
	
	gulp.watch('css/**/*', ['css'])
	
})