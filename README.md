SwarmJS
=======

SwarmJS is callback manager for Javascript. It allows to limit calls per interval.

It is useful when using AJAX API which limits requests per second, but every request should be delivered.

Swarm does not guarantee that callbacks execution will be executed in the same order they were added.


Usage
-----

Create the swarm:

```js
var swarm = new Swarm({
    interval: 1000, // 1 second
    limit: 5 // 5 calls/second
});
```

Add callbacks when it's needed:

```js
swarm.add(callback);
swarm.add(callback, args);
swarm.add(callback, args, scope);
```

Callbacks will be called as soon as possible, but maximum five of them will be called in the same second.
