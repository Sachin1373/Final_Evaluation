
const throttling = (func, delay) => {
    let flag = false;  
  
    return function() {
      if (flag) return;  
  
      flag = true;  
  
      setTimeout(() => {
        func();  
        flag = false;  
      }, delay);
    };
  };
  
  export default throttling;
  