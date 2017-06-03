import gulp from 'gulp'
import gutil from 'gulp-util'
import mocha from 'gulp-mocha'
import webpack from 'webpack'

import webpackConfig from './webpack.config.babel'

gulp.task('test', ['build'], () => {
  gulp.src('tests/*.js', {
    read: false
  }).pipe(mocha({
    compilers: 'js:babel-core/register',
    reporter: 'spec'
  }))
})

gulp.task('watch', ['test'], () => {
  gulp.watch(['src/**/*.js', 'tests/*.js'], ['test'])
})

gulp.task('build', (done) => {
  let config = Object.assign({}, webpackConfig)
  if (process.env.WEBPACK_ENV === 'build') {
    config.output.filename = 'markdown-tokenizer.min.js'
    config.plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true
      }),
    ]
  }
  webpack(config, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('build', err)
    }
    gutil.log('[build]', stats.toString({
      colors: true,
      progress: true,
    }))
    done()
  })
})

gulp.task('default', ['watch'])
