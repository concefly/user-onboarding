import debug from 'debug';

const scopeDebug = debug('onboarding');

function makeBizDebugBase(name: string) {
  return class Base {
    default = scopeDebug.extend(name);
    log = this.default.extend('log');
    info = this.default.extend('info');
    warn = this.default.extend('warn');
    
    private _error = this.default.extend('error');
    error = (formatter: any, ...args: any[]) => {
      console.error(formatter, ...args);
      this._error(formatter, ...args);
    };
  };
}

class NormalDebug extends makeBizDebugBase('normal') {}

/** 通用 debug */
export const normalDebug = new NormalDebug();
