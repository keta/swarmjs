SwarmJS
=======

SwarmJS is callback manager for Javascript allowing to limit calls per interval.

Usage
-----

First, create the swarm:

```js
var swarm = new Swarm({ interval: 1000, limit: 5 });
```

Next, start addnimg callbacks:

```js
swarm.add(callback);
swarm.add(callback, args);
swarm.add(callback, args, scope);
```

Callbacks will be called as soon as possible, but maximum five of them will be called in the same second.

Note that swarm isn't guarantee callbacks execution order.
