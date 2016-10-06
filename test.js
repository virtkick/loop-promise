let assert = require('assert');

require('./')(Promise, {addMethod: true});

function test1() {
  let count = 0;
  let doCancel = false;
  setTimeout(() => {
    doCancel = true;
  }, 1050)
  
  return Promise.loop(() => {
    return new Promise((resolve, reject) => {
      if(doCancel) {
        return reject(new Error('ended'));
      }
      count++;
      setTimeout(resolve, 100);
    });
  }, 100).catch(err => {
    assert(count === 5, 'Body should have run 5 times');
    console.log('Promise.loop OK');
    return;
  }).catch(err => {
    throw err;
  });
}

function test2() {
  let count = 0;
  let doCancel = false;
  setTimeout(() => {
    doCancel = true;
  }, 1050)
  
  return Promise.interval(() => {
    return new Promise((resolve, reject) => {
      if(doCancel) {
        return reject(new Error('ended'));
      }
      count++;
      setTimeout(resolve, 50);
    });
  }, 100).catch(err => {
    assert(count === 10, `Body should have run 10 times, it ran ${count} times`);
    console.log('Promise.interval OK');
    return;
  }).catch(err => {
    throw err;
  });
}

function test3() {
  let count = 0;
  let doCancel = false;
  setTimeout(() => {
    doCancel = true;
  }, 1050)
  let errorCount = 0;
  
  return Promise.interval(() => {
    return new Promise((resolve, reject) => {
      if(doCancel) {
        return reject(new Error('ended'));
      }
      count++;
      setTimeout(resolve, 50);
    });
  }, 100, { 
    onError(err) {
      errorCount += 1;
      if(errorCount > 5) {
        throw err;
      }
    }
  }).catch(err => {
    assert(errorCount === 6, 'onError should have been triggered 6 times');
    console.log('handle onError OK');
    return;
  });
}


Promise.all([test1(), test2(), test3()]).then(() => {
  console.log('All OK');
}).catch(err => {
  console.error('Error', err);
  process.exit(1);
});
