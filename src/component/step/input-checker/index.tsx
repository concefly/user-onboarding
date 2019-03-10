import { h, Component } from 'preact';
import { StepComponentProps } from '../../../interface';
import { StepFocus } from '../focus';
import { makeIntervalPoll } from '../../../util';

export type Props = StepComponentProps['inputChecker'];

export interface State {
  errors: Error[];
}

export class StepInputChecker extends Component<Props, State> {
  clearList: Function[] = [];
  lastValue: string = '';

  state: State = {
    errors: [],
  };

  componentDidMount() {
    // 组件挂载的时候，开始轮询检查 input 值
    const stopInterval = makeIntervalPoll(this.validateValue, 800);

    this.clearList.push(stopInterval);
  }

  componentWillUnmount() {
    this.clearList.forEach(clear => clear());
  }

  getInputValue(): string {
    const { valueCollect, valueCollectField = 'textContent' } = this.props.data;

    const dom = document.querySelector(valueCollect);
    if (!dom) return;

    return dom[valueCollectField];
  }

  validateValue = () => {
    const { rules } = this.props.data;
    const value = this.getInputValue();

    // 值相同就不需要校验了
    if (value === this.lastValue) return;

    const errors: Error[] = [];

    // 逐一检查规则
    rules.forEach(rule => {
      // 正则检查
      if (rule.pattern) {
        // m: 允许跨行匹配
        const reg = new RegExp(rule.pattern, 'm');
        if (!reg.exec(value)) {
          errors.push(new Error(rule.message || `不匹配 ${rule.pattern}`));
        }
      }
    });

    this.lastValue = value;
    this.setState({ errors });
  };

  render() {
    const { content } = this.props.data;
    const { errors } = this.state;

    const newContent =
      content + (errors.length > 0 ? '<br/>' + errors.map(err => err.message).join('<br />') : '');

    return (
      <StepFocus
        {...this.props}
        data={{ ...this.props.data, type: 'focus', content: newContent }}
        // 有错误就不显示“下一步”
        progressChild={errors.length ? null : this.props.progressChild}
      />
    );
  }
}
