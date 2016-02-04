RestrictMixin
=============

A mixin for [`mdg:validated-method`](https://github.com/meteor/validated-method) to throw errors on specified conditions before the `run` function.

Usage
-----

As a mixin:

```js
SomeCollection.methods.someMethod = new ValidateMethod({
    name,
    mixins: [RestrictMixin],
    restrictions: [
        {
          condition: function (data) {
            return !this.userId;
          },
          error: function (data) {
            return new Meteor.Error(this.name + 'unauthorized', 'You must be logged in');
          }
        }
    ],
    validate,
    run: function (data) {}
});
```

You can also create mixins:

```
var isLoggedInMixin = RestrictMixin.createMixin({
    condition: function (data) {
        return !this.userId;
    },
    error: function (data) {
        return new Meteor.Error(this.name + '.unauthorized', 'You must be logged in');
    }
});

SomeCollection.methods.someMethod = new ValidateMethod({
    name,
    mixins: [isLoggedInMixin],
    validate,
    run: function (data) {
      //will not run if !this.userId
    }
});
```

Notes:
- `restrictions` can be an array or object (also value passed to `createMethod`)
- `condition` and `error` can be functions or objects
- `condition` and `error` functions are called in the correct context (`this` is the same as in the `run` method) and get passed the same arguments (which is `data` passed to the method)