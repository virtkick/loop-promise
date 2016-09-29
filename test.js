let assert = require('assert');

require('./')(Promise, {addMethod: true});

let count = 0;
let doCancel = false;
setTimeout(() => {
  doCancel = true;
}, 1050)

Promise.loop(() => {
  return new Promise((resolve, reject) => {
    if(doCancel) {
      return reject(new Error('ended'));
    }
    process.stdout.write('.');
    count++;
    setTimeout(resolve, 100);
  });
}, 100).catch(err => {
  assert(count === 5, 'Body should have run 5 times');
  console.log('OK');
  process.exit(0);
}).catch(err => {
  console.error('Test failed with', err.stack);
  process.exit(1);
});
