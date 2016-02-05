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
          condition: function (args) {
            return !this.userId;
          },
          error: function (args) {
            return new Meteor.Error(this.name + '.unauthorized', 'You must be logged in');
          }
        }
    ],
    validate,
    run: function (args) {}
});
```

You can also create mixins:

```js
var isLoggedInMixin = RestrictMixin.createMixin({
    condition: function (args) {
        return !this.userId;
    },
    error: function (args) {
        return new Meteor.Error(this.name + '.unauthorized', 'You must be logged in');
    }
});

SomeCollection.methods.someMethod = new ValidateMethod({
    name,
    mixins: [isLoggedInMixin],
    validate,
    run: function (args) {
      //will not run if !this.userId
    }
});
```

Notes:
- `restrictions` can be an array or object (also as value passed to `createMethod`)
- `condition` and `error` can be functions or objects
- `condition` and `error` functions are called in the correct context (`this` is the same as in the `run` method) and get passed the same arguments (which is `args` passed to the method)

Environment
-----------

If you want to run a restriction only in the simulation or only on the server, use the `env` field:


```js
SomeCollection.methods.someMethod = new ValidateMethod({
    name,
    mixins: [RestrictMixin],
    restrictions: [
        {
          condition: function (args) {
            return !Meteor.users.find(args.someUserId);
          },
          error: function (args) {
            return new Meteor.Error(this.name + '.notFound', 'User not found');
          },
          env: 'server-only' //this restricion will *not* run if this.isSimulation
        }
    ],
    validate,
    run: function (args) {}
});
```

- Possible `env` values:
    - `'server-only'`
    - `'simulation-only'`
- Runs on both environments if `env` is not specified


Extra: usage with [`ProvideMixin`](https://github.com/ziarno7/provide-mixin)
------------------------------------------------------------------------------------

There might be situations where you want to find an object in the DB
and use it for error triggering - but you shouldn't make a DB query for each
error.
That's where [`ProvideMixin`](https://github.com/ziarno7/provide-mixin) comes in handy
- it adds additional arguments to the `condition()`, `error()`, and `run()` functions.

```js
SomeCollection.methods.someMethod = new ValidateMethod({
    name,
    mixins: [RestrictMixin, ProvideMixin],
    provide: function (args) {
      return SomeOtherCollection.findOne(args.someOtherCollectionId);
    },
    restrictions: [
      {
        condition: function (args, someOtherCollectionItem) {
          return someOtherCollectionItem.owner !== this.userId;
        },
        error: function (args, someOtherCollectionItem) {
          return new Meteor.Error(this.name + '.unauthorized', 'Only owners can do stuff');
        },
      }
    ],
    validate,
    run: function (args, someOtherCollectionItem) {
      //...
    }
});
```
