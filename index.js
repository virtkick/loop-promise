module.exports = function(Promise, opts) {
  if(!Promise) {
    throw new Error('You need to pass Promise imple');
  }
  
  function startLoop(loopBody, interval) {
    let timeoutHandle;
    let cancelHandler = () => clearTimeout(timeoutHandle);
    let loopHandler = reject => {
      timeoutHandle = setTimeout(() => {
        Promise.resolve()
          .then(() => loopBody())
          .then(() => loopHandler(reject))
          .catch(reject);
      }, interval);
    };
  
    return new Promise((resolve, reject, onCancel) => {
      if(onCancel) onCancel(cancelHandler);
      loopHandler(reject);
    });
  }
  if(opts && opts.addMethod) {
    Promise.loop = startLoop;
  }
};
