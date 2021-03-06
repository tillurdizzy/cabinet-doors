
var gulp			= require('gulp');
var concat			= require('gulp-concat');
var rename			= require('gulp-rename');
var uglify			= require('gulp-uglify');
var sass			= require('gulp-sass');
var postcss			= require('gulp-postcss');
var csswring		= require('csswring');
var autoprefixer	= require('autoprefixer');

/* tasks */
gulp.task('devjs', function () {
	return gulp.src([
		'public/js/*.js',
		'public/js/controllers/*.js',
		'public/js/directives/*.js',
		'public/js/services/*.js'])
	.pipe(concat('dev.js'))
	.pipe(gulp.dest('public/resources/dist'));

});

/* vendor dependencies */
gulp.task('jsbundle',function(){
	return gulp.src([
		'public/bundle/modernizr.js',
		'public/bundle/jquery.min.js',
		'public/bundle/angular-ui-router.min.js',
		'public/bundle/ng-underscore.min.js',
		'public/bundle/smart-table.min.js'])
	.pipe(concat('bundle.js'))
	.pipe(gulp.dest('public'));
});

gulp.task('distjs', function(){
	return gulp.src(['public/deps.js'])
	.pipe(rename('deps.min.js'))
	.pipe(uglify())
	.on('error',console.error.bind(console))
	.pipe(gulp.dest('bin'));
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('public/resources/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function(){
	var processors=[
		csswring,autoprefixer
	];
	return gulp.src(['scss/app.scss'])
	.pipe(sass())
	//.pipe(postcss(processors))
	.pipe(gulp.dest('public/css'));
});

gulp.task('watch', function(){
    gulp.watch('public/js/**/*.js', ['jshint']);
	gulp.watch(['scss/*.scss'],['sass']);
});

// define the default task and add the watch task to it
gulp.task('default', ['watch']);