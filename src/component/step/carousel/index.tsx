import { h, Component } from 'preact';
import { StepComponentProps } from '../../../interface';
import { Left, Right } from './svg';
import { Mask } from '../../mask';

export type Props = StepComponentProps['carousel'];

export interface State {
  index: number;
}

export class StepCarousel extends Component<Props, State> {
  state: State = {
    index: 0,
  };

  get currentCarouselChild() {
    const item = this.props.data.children[this.state.index];

    // 暂时只支持 img
    return <img src={item} />;
  }

  get isTheFirst() {
    return this.state.index === 0;
  }

  get isTheLast() {
    return this.state.index === this.props.data.children.length - 1;
  }

  handlePre = () => {
    const index = this.state.index - 1;
    this.setState({ index });
  };

  handleNext = () => {
    const index = this.state.index + 1;
    this.setState({ index });
  };

  handleFinish = () => {
    this.props.onNext();
  };

  render() {
    const { topOffset, leftOffset, width } = this.props.data;

    const wrapperStyle = {
      position: 'fixed',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    };

    const contentStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '16px',
      minWidth: '200px',
      width,
      marginTop: topOffset && `${topOffset}px`,
      marginLeft: leftOffset && `${leftOffset}px`,
      border: '1px solid #ECECEC',
      borderRadius: '4px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.39)',
      background: '#fff',
    };

    const preStyle = {
      position: 'absolute',
      top: '50%',
      left: '-50px',
      width: '24px',
      height: '24px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      fill: '#ccc',
    };
    const nextStyle = {
      position: 'absolute',
      top: '50%',
      right: '-50px',
      width: '24px',
      height: '24px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      fill: '#ccc',
    };

    return (
      <div style={wrapperStyle}>
        <div style={contentStyle}>
          {/* 上一个按钮 */}
          {!this.isTheFirst && <Left style={preStyle} onClick={this.handlePre} />}

          {this.currentCarouselChild}

          {/* 下一个按钮 */}
          {this.isTheLast ? (
            <span style={nextStyle} onClick={this.handleFinish}>
              完成
            </span>
          ) : (
            <Right style={nextStyle} onClick={this.handleNext} />
          )}
        </div>
      </div>
    );
  }
}
