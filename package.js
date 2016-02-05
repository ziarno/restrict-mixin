Package.describe({
  name: 'ziarno:restrict-mixin',
  version: '0.0.4',
  summary: 'A mixin to mdg:validated-method used to throw errors if condition pass',
  git: 'https://github.com/ziarno7/restrict-mixin',
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
