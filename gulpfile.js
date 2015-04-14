var gulp = require("gulp"),
	minifyCSS = require("gulp-minify-css"),
	uglify = require("gulp-uglify");

gulp.task("default",function(){
	gulp.start("minifyCSS", "minifyJS");
});

gulp.task("minifyCSS", function(){
	return gulp.src("./css/*.css")
		.pipe(minifyCSS())
		.pipe(gulp.dest("./public/css/"));
});

gulp.task("minifyJS", function(){
	return gulp.src("./js/*.js")
		.pipe(uglify())
		.pipe(gulp.dest("./public/js/"));
});