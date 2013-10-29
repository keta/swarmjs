SwarmJS
=======

SwarmJS is a callback manager for Javascript.

It allows to limit calls per interval, which is useful when using AJAX API which limits requests per second, but every request should be delivered.

Swarm does not guarantee that callbacks will be executed in the same order they were added.

Licensed under [MIT license](http://www.opensource.org/licenses/mit-license.php).


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
