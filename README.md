RestrictMixin
=============

A mixin for [`mdg:validated-method`](https://github.com/meteor/validated-method) to throw errors on specified conditions before the `run` function.

Install
-------

`meteor add ziarno:restrict-mixin`

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

```js
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
- `restrictions` can be an array or object (also as value passed to `createMethod`)
- `condition` and `error` can be functions or objects
- `condition` and `error` functions are called in the correct context (`this` is the same as in the `run` method) and get passed the same arguments (which is `data` passed to the method)

Environment
-----------

If you want to run a restriction only in the simulation or only on the server, use the `env` field:


```js
SomeCollection.methods.someMethod = new ValidateMethod({
    name,
    mixins: [RestrictMixin],
    restrictions: [
        {
          condition: function (someUserId) {
            return !Meteor.users.find(someUserId);
          },
          error: function (data) {
            return new Meteor.Error(this.name + 'notFound', 'User not found');
          },
          env: 'server-only' //this restricion will *not* run if this.isSimulation
        }
    ],
    validate,
    run: function (data) {}
});
```

- Possible `env` values:
    - `'server-only'`
    - `'simulation-only'`
- Runs on both environments if `env` is not specified
