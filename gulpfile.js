const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const ejs = require('gulp-ejs');
const sass = require('gulp-sass');
const gls = require('gulp-live-server');
const server = gls.static('dist',8899);

const resumePath = path.join(__dirname,'resume.json');
const templatePath = path.join(__dirname,'template');
const stylesheetPath = path.join(__dirname,'stylesheet')

function getData(resumePath){
    const resume = JSON.parse(fs.readFileSync(resumePath));
    const language = JSON.parse(fs.readFileSync(path.join(__dirname,'/language/'+ resume.language + '.json')));
    let data = Object.assign(resume,language);
    return data;
}

gulp.task('template',()=>{
    const data = getData(resumePath);
    return gulp.src(path.join(templatePath,'index.html'))
        .pipe(ejs(data))
        .pipe(gulp.dest('dist'));
});

gulp.task('stylesheet',()=>{
    return gulp.src(path.join(stylesheetPath,'style.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});


gulp.task('watch',gulp.series('template','stylesheet',()=>{
    server.start();

    gulp.watch([
        path.join(__dirname,'language','**'),
        path.join(templatePath,'**','*'),
        path.join(resumePath)
    ],gulp.series('template'));

    gulp.watch([path.join(stylesheetPath,'**','*')],gulp.series('stylesheet'));

}));