Package.describe({
  name: 'ziarno:restrict-mixin',
  version: '0.0.2',
  summary: 'A mixin to mdf:validate-method used to throw errors if condition pass',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('underscore');
  api.addFiles('restrict-mixin.js');
  api.export('RestrictMixin');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('ziarno:restrict-mixin');
  api.addFiles('restrict-mixin-tests.js');
});
