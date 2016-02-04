RestrictMixin = function RestrictMixin(methodOptions) {
  return RestrictMixin.createMixin(methodOptions.restrictions)(methodOptions);
};

RestrictMixin.createMixin = function createMixin(restrictions) {

  var ENV_TYPES = {
    SIMULATION_ONLY: 'simulation-only',
    SERVER_ONLY: 'server-only'
  };

  function checkRestrictions(restrictions) {
    var args = Array.prototype.slice.call(arguments, 1);
    var restrictionsArray = _.isArray(restrictions) ?
      restrictions : [restrictions];

    restrictionsArray.forEach(function(restriction) {
      var env = restriction.env;

      if ((this.isSimulation && env === ENV_TYPES.SERVER_ONLY) ||
          (!this.isSimulation && env === ENV_TYPES.SIMULATION_ONLY)) {
        return;
      }

      var condition = _.isFunction(restriction.condition) ?
        restriction.condition.apply(this, args) :
        restriction.condition;
      var error = _.isFunction(restriction.error) ?
        restriction.error.apply(this, args) :
        restriction.error;

      if (condition) {
        throw error;
      }
    }.bind(this));
  }

  return function (methodOptions) {
    methodOptions.run = _.wrap(methodOptions.run,
      function (originalRun) {
        var args = Array.prototype.slice.call(arguments, 1);
        checkRestrictions.apply(this, [restrictions].concat(args));
        return originalRun.apply(this, args);
      }
    );

    return methodOptions;
  }
};