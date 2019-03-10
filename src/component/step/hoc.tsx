import { h, Component } from 'preact';
import { StepComponentProps } from '../../interface';
import { normalDebug } from '../../debug';
import { Button } from '../button';
import { Progress } from '../progress';
import { isEqualOrChild, makeEventListener, debounce } from '../../util';

type Props = StepComponentProps['base'];

export function withStepZIndex<T extends any>(Comp: T): T {
  return function(props: Props) {
    const wrapperStyle = {
      position: 'relative',
      zIndex: props.data.zIndex,
    };

    return (
      <div style={wrapperStyle}>
        <Comp {...props} />
      </div>
    );
  } as any;
}

export function withStepWaitUntil<T extends any>(Comp: T): T {
  const NewComp = class extends Component<Props> {
    state = {
      // 没有 waitUntil, 则直接开始
      isOk: !this.props.data.waitUntil,
    };

    stopWait: Function;

    componentDidMount() {
      const { stop } = this.startWait();
      this.stopWait = stop;
    }

    componentWillUnmount() {
      this.stopWait && this.stopWait();
    }

    startWait(): { stop: Function } {
      const { waitUntil } = this.props.data;

      const done = (err: Error) => {
        if (err) return;
        this.setState({ isOk: true });
      };

      const stopFunList = [];

      // 没有 waitUntil, 则直接开始
      if (!waitUntil) {
        this.setState({ isOk: true });
        return { stop: () => {} };
      }

      // selector
      if (waitUntil.selector) {
        const { stop } = this.startWaitSelector(waitUntil.selector, err => {
          normalDebug.log('wait selector done: err=%s', err);
          done(err);
        });
        stopFunList.push(stop);

        normalDebug.log('start wait selector: %s', waitUntil.selector);
      }

      // delay
      if (waitUntil.delay) {
        const { stop } = this.startWaitDelay(waitUntil.delay, err => {
          normalDebug.log('wait delay done: err=%s', err);
          done(err);
        });
        stopFunList.push(stop);

        normalDebug.log('start wait delay: %s ms', waitUntil.delay);
      }

      return {
        stop: () => {
          stopFunList.forEach(stop => stop());
        },
      };
    }

    startWaitSelector(selector: string, done: (err: Error) => void) {
      // 如果检测到了，可以直接返回
      if (document.querySelector(selector)) {
        done(null);
        return {
          stop: () => {},
        };
      }

      let timer = setInterval(() => {
        const dom = document.querySelector(selector);

        if (dom) {
          clearInterval(timer);
          return done(null);
        }
      }, 300);

      return {
        stop: () => clearInterval(timer),
      };
    }

    startWaitDelay(ms: number, done: (err: Error) => void) {
      let timer = setTimeout(() => done(null), ms);

      return {
        stop: () => clearTimeout(timer),
      };
    }

    render() {
      return this.state.isOk ? <Comp {...this.props} /> : null;
    }
  };

  return NewComp as any;
}

export function withStepProgress<T extends any>(Comp: T): T {
  const NewComp = class extends Component<Props> {
    cancelBind: Function;

    componentDidMount() {
      const { stop } = this.startBind();
      this.cancelBind = stop;
    }

    componentWillUnmount() {
      this.cancelBind && this.cancelBind();
    }

    startBind(): { stop: Function } {
      const { nextStepTrigger } = this.props.data;

      const done = (err: Error) => {
        if (err) return;
        this.setState({ isOk: true });
      };

      const stopFunList = [];

      if (nextStepTrigger) {
        const { stop } = this.startBindNextStepTrigger(nextStepTrigger, err => {
          normalDebug.log('bind nextStepTrigger done: err=%s', err);
          done(err);
        });
        stopFunList.push(stop);

        normalDebug.log('start bind nextStepTrigger: %s', nextStepTrigger);
      }

      return {
        stop: () => {
          stopFunList.forEach(stop => stop());
        },
      };
    }

    startBindNextStepTrigger(nextStepTrigger: string, done: (err: Error) => void) {
      const handleNext = (e: MouseEvent) => {
        const target = e.target;
        const dom = document.querySelector(nextStepTrigger);

        if (dom && isEqualOrChild(target as any, dom as any)) {
          normalDebug.log('nextStepTrigger clicked: selector=%s', nextStepTrigger);
          this.handleNext();
        }
      };

      document.body.addEventListener('click', handleNext);
      done(null);

      return {
        stop: () => document.body.removeEventListener('click', handleNext),
      };
    }

    handleCancel = () => {
      this.props.onCancel && this.props.onCancel();
    };

    handleNext = () => {
      this.props.onNext && this.props.onNext();
    };

    getProgressChild() {
      const { nextStepTrigger } = this.props.data;
      const isLast = this.props.stepIndex + 1 === this.props.stepTotal;

      return [
        <Button key='1' onClick={this.handleCancel} style={{ background: '#ccc' }}>
          退出
        </Button>,
        nextStepTrigger ? null : (
          <Button key='2' onClick={this.handleNext} style={{ marginLeft: '16px' }}>
            {isLast ? '完成' : '下一步'}
          </Button>
        ),
      ];
    }

    render() {
      const progressChild = this.getProgressChild();

      return <Comp {...this.props} progressChild={progressChild} />;
    }
  };

  return NewComp as any;
}

export function withResizeUpdate<T extends any>(Comp: T): T {
  const NewComp = class extends Component<Props> {
    removeListener: Function;

    componentDidMount() {
      this.removeListener = makeEventListener(this.handleResize, 'resize');
    }

    componentWillUnmount() {
      this.removeListener && this.removeListener();
    }

    handleResize = debounce(() => {
      normalDebug.log('update due to resize');
      this.forceUpdate();
    }, 500);

    render() {
      return <Comp {...this.props} />;
    }
  };

  return NewComp as any;
}

export function withAllStepHelper<T extends any>(Comp: T): T {
  // withStepWaitUntil 会控制组件是否渲染，需要放在第一个位置
  return [withStepWaitUntil, withStepZIndex, withStepProgress, withResizeUpdate].reduceRight(
    (C, handler) => handler(C),
    Comp
  );
}
