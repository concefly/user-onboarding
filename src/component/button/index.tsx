import { h, Component } from 'preact';
import { ThemeContext } from '../provider/theme';

export type Props = {
  onClick?: () => void;
  style?: any;
};

export interface State {}

/** 按钮组件 */
export class Button extends Component<Props, State> {
  render() {
    const { onClick, children, style } = this.props;

    return (
      <ThemeContext.Consumer>
        {theme => {
          const btnStyle = {
            display: 'inline-block',
            padding: '6px',            
            lineHeight: '1',
            color: '#fff',
            background: theme && theme.brandColor,
            cursor: 'pointer',
            ...style,
          };

          return (
            // 为避免 button 标签带来的默认样式，所以这里用 div 来画按钮
            <div onClick={onClick} style={btnStyle}>
              {children}
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
