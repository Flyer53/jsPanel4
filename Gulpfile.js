/* global require, exports */
const { series, src, dest } = require('gulp');
const babel    = require('gulp-babel');
const minify   = require('gulp-minify');
const sass     = require('gulp-sass')(require('node-sass'));
const cleanCSS = require('gulp-clean-css');
const rename   = require('gulp-rename');
const header   = require('gulp-header');
const footer   = require('gulp-footer');
const pkg      = require('./package.json');


let header_banner_strict = ['',
    '\'use strict\';',
    ''].join('\n');

let header_banner = ['/**',
    ' * jsPanel - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @homepage <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' * @author <%= pkg.author.name %> - <%= pkg.author.email %>',
    ' * @github <%= pkg.repository.url %>',
    ' */',
    ''].join('\n');

let header_banner_es6_export = '\nexport ';

let header_banner_es6_import = '\nimport {jsPanel} from \'../../jspanel.js\';\n\n';

let footer_banner = ['\n',
    '// Add CommonJS module exports, so it can be imported using require() in Node.js',
    '// https://nodejs.org/docs/latest/api/modules.html',
    'if (typeof module !== \'undefined\') { module.exports = jsPanel; }',
    ''].join('\n');

function scss() {
    return src('source/**/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(header(header_banner, { pkg : pkg } ))
        .pipe(dest('dist/'))
        .pipe(dest('es6module/'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(dest('dist/'))
        .pipe(dest('es6module/'));
}

function jspanel() {
    // calendar extension excluded because it's only experimental
    return src('source/**/*.js')
        .pipe(babel({
            presets: [
                ['@babel/env', {
                    'modules': false
                }]
            ]
        }))
        .pipe(header(header_banner_strict, { pkg : pkg } ))
        .pipe(header(header_banner, { pkg : pkg } ))
        .pipe(footer(footer_banner, { pkg : pkg } ))
        .pipe(dest('dist'))
        .pipe(minify({
            ext:{ min:'.min.js' }
        }))
        .pipe(dest('dist'));
}
function jspanel_es6() {
    return src('source/jspanel.js')
        .pipe(header(header_banner_es6_export, { pkg : pkg } ))
        .pipe(header(header_banner, { pkg : pkg } ))
        .pipe(dest('es6module/'))
        .pipe(minify({
            ext:{ min:'.min.js' }
        }))
        .pipe(dest('es6module/'));
}
// don't merge jspanel_es6 with jspanel_extensions_es6 because extensions don't export anything but need the import statement
function jspanel_extensions_es6() {
    // calendar extension excluded because it's only experimental
    return src('source/extensions/**/*.js')
        .pipe(header(header_banner_es6_import, { pkg : pkg } ))
        .pipe(header(header_banner, { pkg : pkg } ))
        .pipe(dest('es6module/extensions/'))
        .pipe(minify({
            ext:{ min:'.min.js' }
        }))
        .pipe(dest('es6module/extensions/'));
}

function template() {
    return src('template_standard.html')
        .pipe(rename('index.html'))
        .pipe(dest('dist/'));
}
function templateES6() {
    return src('template_es6module.html')
        .pipe(rename('index.html'))
        .pipe(dest('es6module/'));
}




exports.default = series(jspanel, jspanel_es6, jspanel_extensions_es6, scss, template, templateES6);
