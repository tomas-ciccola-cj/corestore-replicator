# corestore replicator

```
npm install
```

to run pass a path to save the corestore and a list of names to give the hypercores
```
node peer.js  /tmp/my-store my-core another-core
```

then, on another computer:
```
node peer.js /tmp/other-store my-other-core and-another-core
```
peers will share the public keys of the cores with each other

## TODO
since replication and keysharing is happening on the same socket, things will crash when start replicating.
I remember there was a way to create an extension but couldn't find any documentation
