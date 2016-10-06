module.exports = function(Promise, opts) {
  if(!Promise) {
    throw new Error('You need to pass Promise imple');
  }
  
  function loop(loopBody, interval, {onError} = {}) {
    let timeoutHandle;
    let cancelHandler = () => clearTimeout(timeoutHandle);
    let loopHandler = reject => {
      timeoutHandle = setTimeout(() => {
        Promise.resolve()
          .then(() => loopBody())
          .then(() => loopHandler(reject))
          .catch(err => {
            if(onError) {
              onError(err);
              return loopHandler(reject);
            }
            throw err;
          })
          .catch(reject);
      }, interval);
    };
  
    return new Promise((resolve, reject, onCancel) => {
      if(onCancel) onCancel(cancelHandler);
      loopHandler(reject);
    });
  }
  if(opts && opts.addMethod) {
    Promise.loop = loop;
  }

  function getTime() {
    return new Date().getTime();
  }

  function interval(loopBody, interval, {onError} = {}) {
    let timeoutHandle;
    let cancelHandler = () => clearTimeout(timeoutHandle);
    let loopHandler = (reject, timeout = interval) => {
      timeoutHandle = setTimeout(() => {
        let startTime = getTime();
        Promise.resolve()
          .then(() => loopBody())
          .then(() => loopHandler(reject, interval - (getTime() - startTime)))
          .catch(err => {
            if(onError) {
              onError(err);
              return loopHandler(reject);
            }
            throw err;
          })
          .catch(reject);
      }, timeout);
    };
  
    return new Promise((resolve, reject, onCancel) => {
      if(onCancel) onCancel(cancelHandler);
      loopHandler(reject);
    });
  }
  if(opts && opts.addMethod) {
    Promise.interval = interval;
  }  
  
  return {
    loop: loop,
    interval: interval
  };
};
