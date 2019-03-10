import { h, Component } from 'preact';
import { StepComponentProps } from '../../../interface';

export type Props = StepComponentProps['notice'];

export interface State {}

export class StepNotice extends Component<Props, State> {
  render() {
    const { content, leftOffset, topOffset, width } = this.props.data;

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
      marginTop: topOffset && `${topOffset}px`,
      marginLeft: leftOffset && `${leftOffset}px`,
      minWidth: '200px',
      width,
      border: '1px solid #ECECEC',
      borderRadius: '4px',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.39)',
      background: '#fff',
    };

    const footerStyle = {
      marginTop: '16px',
      textAlign: 'right',
    };

    return (
      <div style={wrapperStyle}>
        <div style={contentStyle}>
          <div dangerouslySetInnerHTML={{ __html: content }} />

          {this.props.progressChild && (
            <footer style={footerStyle}>{this.props.progressChild}</footer>
          )}
        </div>
      </div>
    );
  }
}
