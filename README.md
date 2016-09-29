# loop-promise
Run infinite loops with promises. Cancellation enabled if using Bluebird.

## Usage

* Plain node

```js
require('loop-promise')(Promise, {addMethod: true});

let loopPromise = Promise.loop(() => doSomethingThatReturnsPromise(), 100);
// running interval will be timeToRunLoopBody + 100ms

loopPromise.catch(err => {
  console.error('Loop failed with error', err);
});

// if Promise comes from bluebird and cancellation is enabled then you can also cancel the loop
// otherwise cancelling could done manually by throwing a pre-defined error and catching it outside
loopPromise.cancel();
```

You can also pass values through loop iterations

```js
Promise.loop(val => val + 1, 100, 0); // 0 is the initial value passed to the loop body
```
