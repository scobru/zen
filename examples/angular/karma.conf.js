import __karma_jasmine from 'karma-jasmine';
import __karma_chrome_launcher from 'karma-chrome-launcher';
import __karma_jasmine_html_reporter from 'karma-jasmine-html-reporter';
import __karma_coverage_istanbul_reporter from 'karma-coverage-istanbul-reporter';
import __karma from '@angular/cli/plugins/karma';

export default function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      __karma_jasmine,
      __karma_chrome_launcher,
      __karma_jasmine_html_reporter,
      __karma_coverage_istanbul_reporter,
      __karma
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'coverage-istanbul']
              : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
}
