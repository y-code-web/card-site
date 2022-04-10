
// const babel = require("@babel/core"),
// const "@babel/preset-env",
const gulp = require("gulp"),
	autoprefixer = require("autoprefixer"),
	bs = require("browser-sync").create(),
	mqpacker = require("css-mqpacker"),
	del = require("del"),
	gulpCached = require("gulp-cached"),
	gulpCheerio = require("gulp-cheerio"),
	gulpCleanCss = require("gulp-clean-css"),
	gulpFavicons = require("gulp-favicons"),
	gulpFileInclude = require("gulp-file-include"),
	gulpFonter = require("gulp-fonter"),
	gulpImagemin = require("gulp-imagemin"),
	gulpMode = require("gulp-mode")(),
	gulpNewer = require("gulp-newer"),
	gulpNotify = require("gulp-notify"),
	gulpPlumber = require("gulp-plumber"),
	gulpPostcss = require("gulp-postcss"),
	gulpRename = require("gulp-rename"),
	gulpSass = require("gulp-sass"),
	gulpSassGlob = require('gulp-sass-glob'),
	gulpSourcemaps = require("gulp-sourcemaps"),
	gulpSvgSprite = require("gulp-svg-sprite"),
	gulpSvgmin = require("gulp-svgmin"),
	gulpTerser = require("gulp-terser"),
	gulpTtf2woff = require("gulp-ttf2woff"),
	gulpTtf2woff2 = require("gulp-ttf2woff2"),
	imageminJpegRecompress = require("imagemin-jpeg-recompress"),
	imageminPngquant = require("imagemin-pngquant"),
	imageminSvgo = require("imagemin-svgo"),
	npmfiles = require("npmfiles"),
	sortCssMediaQueries = require("sort-css-media-queries"),
	gulpReplace = require('gulp-replace');

const src = './src';
const build = './build';
const dist = './dist';
	
const paths  = {
	src: {
		html: `${src}/views/**/*.html`,
		fonts: `${src}/assets/fonts/**/*`,
		images: `${src}/assets/img/**/*.{jpg,jpeg,png,gif,svg}`,
		svg: `${src}/assets/icons/svg/*.svg`,
		png: `${src}/assets/icons/png/*.png`,
		audio: `${src}/assets/audio/*`,
		video: `${src}/assets/video/*`,
		js: `${src}/scripts/main.js`,
		scss: `${src}/styles/styles.scss`,
		favicons: `${src}/assets/favicons/*.{jpg,jpeg,png,gif}`
	},
	devDest: {
		fonts: `${src}/assets/fonts`,		
	},
	buildDest: {
		html: `${build}`,
		fonts: `${build}/fonts`,
		images: `${build}/img`,
		audio: `${build}/audio`,
		video: `${build}/video`,
		js: `${build}/js`,
		css: `${build}/css`,
	},
	distDest: {
		html: `${dist}`,
		html_guide: `${dist}/guide/`,
		fonts: `${dist}/fonts`,
		images: `${dist}/img`,
		audio: `${dist}/audio`,
		video: `${dist}/video`,
		js: `${dist}/js`,
		css: `${dist}/css`,
	},
	watch: {
		scss: `${src}/**/*.scss`,
		html: `${src}/**/*.html`,
		js: `${src}/**/*.js`,
	},
	filePathForClean: {
		fonts: `${src}/assets/fonts/*.otf`,
		guide: [`${build}/guide.html`]
	}
}


function bsInit() {	
	bs.init({
		server: paths.buildDest.html,
		port: 8080,
		notify: false,
		tunnel: 'chdev',
		socket: {
			domain: 'localhost:8080'
		},
		scrollProportionally: false
	});
};

function bsReload(done) {
  bs.reload();
  done();
}

function watchFiles() {
	gulp.watch(paths.watch.html, html);
	gulp.watch(paths.watch.js, scripts);
	gulp.watch(paths.watch.scss, styles);
};

function clean() {
	return del([paths.buildDest.html])
};

function cleanGude() {
	return del([paths.distDest.html_guide])
};

function audio() {
  return gulp.src(paths.src.audio)
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.audio)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.audio)));
};

function favicons() {
	return gulp.src(paths.src.favicons)
		.pipe(gulpFavicons({
			icons: {
				appleIcon: false,
				favicons: true,
				online: false,
				appleStartup: false,
				android: false,
				firefox: false,
				yandex: false,
				windows: false,
				coast: false
			}
		}))
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.html)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.html)));
};



function fontsOtfToTtfTask() {
	return gulp.src(`${paths.src.fonts}.otf`)
    .pipe(gulpFonter({formats: ['ttf']}))
    .pipe(gulp.dest(paths.devDest.fonts))
};
function cleanOtf() {
	return del([paths.filePathForClean.fonts])
};
function ttf2woffTask() {
	return gulp.src(`${paths.src.fonts}.ttf`)
		.pipe(gulpTtf2woff())
		.pipe(gulp.dest(paths.buildDest.fonts))
};
function ttf2woff2Task() {
	return gulp.src(`${paths.src.fonts}.ttf`)
		.pipe(gulpTtf2woff2())
		.pipe(gulp.dest(paths.buildDest.fonts))
};
function fonts() {
	return gulp.src(`${paths.src.fonts}.{woff,woff2}`)
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.fonts)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.fonts)));
};


function html() {
	return gulp.src(paths.src.html)
		.pipe(gulpPlumber({
			errorHandler: gulpNotify
				.onError(err => {
					return {
						title: 'Plumber Error: HTML',
						message: err.message
					}
				})
			})
		)
		.pipe(gulpFileInclude({
			basepath: '@root'
		}))
		.pipe(gulpMode.development(gulpCached()))
		.pipe(gulpPlumber.stop())
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.html)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.html)))
		.pipe(gulpMode.development(bs.stream()));
};

function images() {
	return gulp.src(paths.src.images)
		.pipe(gulpNewer(paths.buildDest.images))
		.pipe(
			gulpMode.production(
				gulpImagemin(
					{
						verbose: true,
						plugins: [
							imageminJpegRecompress({
								loops: 3,
								quality: "high",
								min: 80,
								max: 90,
								progressive: true
							}),
							imageminSvgo({
								plugins: [
									{
										removeViewBox: false,
										removeUselessStrokeAndFill: false
									}
								]
							}),
							imageminPngquant({quality: [0.8, 0.9], speed: 1})
						]
					}
				)
			)
		)
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.images)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.images)))
};

function npmFiles() {
	return gulp.src(npmfiles({
			showWarnings: true,
			nodeModulesPath: 'node_modules',
			packageJsonPath: './package.json',
		}))
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.js)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.js)))
};

function scripts() {
	return gulp.src(paths.src.js)
		.pipe(gulpMode.development(gulpSourcemaps.init({loadMaps: true})))
		.pipe(gulpMode.development(
			gulpPlumber({
				errorHandler: gulpNotify
				.onError(err => {
					return {
						title: 'Plumber Error: HTML',
						message: err.message
					}
				})
			})
		))
		.pipe(gulpFileInclude({
			basepath: '@file'
		}))
		.pipe(gulpMode.development(gulpCached()))
		.pipe(gulpMode.development(gulpPlumber.stop()))
		.pipe(gulpMode.development(gulpSourcemaps.write()))
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.js)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.js)))
		.pipe(gulpMode.production(gulpTerser({output: { comments: false }})))
		.pipe(gulpMode.production(gulpRename('main.min.js')))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.js)))
		.pipe(gulpMode.development(bs.stream()));
};


function styles() {
	return gulp.src(paths.src.scss)
		.pipe(gulpMode.development(
			gulpPlumber({
				errorHandler: gulpNotify
				.onError(err => {
					return {
						title: 'Plumber Error: Styles',
						message: err.message
					}
				})
			})
		))
		.pipe(gulpMode.development(gulpSourcemaps.init({loadMaps: true})))
		.pipe(gulpSassGlob())
		.pipe(gulpSass({
				outputStyle: 'expanded',
				errLogToConsole: true,
				includePaths: ['node_modules']
			})
			.on('error', gulpSass.logError)
		)
		.pipe(gulpMode.production(
				gulpPostcss(
					[
						autoprefixer({
							cascade: false
						}),
						mqpacker({
							sort: sortCssMediaQueries
						})
					]
				)
			)
		)
		.pipe(gulpMode.development((gulpSourcemaps.write('./'))))
		.pipe(gulpMode.development(gulpPlumber.stop()))
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.css)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.css)))
		.pipe(gulpMode.production(gulpRename('styles.min.css')))
		.pipe(gulpMode.production(gulpCleanCss({rebase: false})))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.css)))
		.pipe(gulpMode.development(bs.stream()))
};


function svgSprite() {
	return gulp.src(paths.src.svg)
		.pipe(gulpSvgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(gulpCheerio({
			run: ($) => {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(gulpReplace('&gt;', '>'))
		.pipe(gulpMode.development(
			gulpSvgSprite({
				mode: {
					symbol: {
						dest: paths.buildDest.images,
						sprite: 'svgSprite.svg',
						example: false,
						render: {
							css: false,
							scss: false
						}
					}
				}
			})
		))
		.pipe(gulpMode.production(
			gulpSvgSprite({
				mode: {
					symbol: {
						dest: paths.distDest.images,
						sprite: 'svgSprite.svg',
						example: false,
						render: {
							css: false,
							scss: false
						}
					}
				}
			})
		))
		.pipe(gulp.dest('./'))
};


function video() {
  return gulp.src(paths.src.video)
		.pipe(gulpMode.development(gulp.dest(paths.buildDest.video)))
		.pipe(gulpMode.production(gulp.dest(paths.distDest.video)))
		
};




exports.watchFiles = watchFiles;
exports.clean = clean;
exports.audio = audio;
exports.favicons = favicons;
exports.fontsOtfToTtfTask = fontsOtfToTtfTask;
exports.cleanOtf = cleanOtf;
exports.ttf2woffTask = ttf2woffTask;
exports.ttf2woff2Task = ttf2woff2Task;
exports.fonts = fonts;
exports.html = html;
exports.images = images;
exports.npmFiles = npmFiles;
exports.scripts = scripts;
exports.styles = styles;
exports.svgSprite = svgSprite;
exports.video = video;

const tasks = 
	gulp.series(
		clean,
		gulp.parallel(
			svgSprite,
			html,
			styles,
			scripts,
			npmFiles,
			favicons,
			images,
			fonts,
			audio,
			video,
		)
	);

exports.build = gulp.series(
	tasks,
	cleanGude
);
exports.default = gulp.series(
	tasks,
	gulp.parallel(
		watchFiles,
		bsInit
	)
);