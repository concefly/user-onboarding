import { h, Component } from 'preact';

export type Props = {
  percent: number;
  style?: any;
};

export interface State {}

export class Progress extends Component<Props, State> {
  render() {
    const { percent, style } = this.props;

    const progressStyle = {
      minWidth: '10px',
      height: '5px',
      border: '1px solid #DADADA',
      ...style,
    };

    const barStyle = {
      height: '100%',
      backgroundColor: '#DADADA',
      width: Math.min(Math.max(0, percent), 100) + '%',
    };

    return (
      <div style={progressStyle}>
        <div style={barStyle} />
      </div>
    );
  }
}
