/** 定时轮询 */
export function makeIntervalPoll(callback: Function, ms: number) {
  let timer = setInterval(callback, ms);

  return () => {
    clearInterval(timer);
  };
}

export function makeEventListener(callback: Function, event: string, target: any = window) {
  target.addEventListener(event, callback);

  return () => {
    target.removeEventListener(event, callback);
  };
}

export function isEqualOrChild(child: HTMLElement, parent: HTMLElement) {
  for (let current = child; !!current; current = current.parentElement) {
    if (current === parent) return true;
  }

  return false;
}

export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: any;

  return function() {
    let context = this,
      args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
