import { h, Component } from 'preact';

export interface Props {
  targetDom?: Element;
  area?: {
    right: number;
    bottom: number;
    left: number;
    top: number;
  };
}

export class Mask extends Component<Props> {
  componentDidMount() {
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.width = 'auto';
  }

  getOffset() {
    const { targetDom, area } = this.props;

    if (targetDom) {
      return targetDom.getBoundingClientRect();
    }

    if (area) {
      return area;
    }
  }

  render() {
    const offset = this.getOffset();

    const wrapperStyle = {
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: '100vw',
      zIndex: 1000,
      pointerEvents: 'none',
    };

    const maskCommonStyle = {
      position: 'absolute',
      background: 'rgba(0,0,0,.5)',
      pointerEvents: 'initial',
    };

    return (
      <div style={wrapperStyle}>
        {offset ? (
          [
            // top
            <div
              key='1'
              style={{ ...maskCommonStyle, top: 0, left: 0, right: 0, height: offset.top }}
            />,

            // right
            <div
              key='2'
              style={{
                ...maskCommonStyle,
                top: offset.top,
                left: offset.right,
                right: 0,
                height: offset.bottom - offset.top,
              }}
            />,

            // bottom
            <div
              key='3'
              style={{ ...maskCommonStyle, top: offset.bottom, left: 0, right: 0, bottom: 0 }}
            />,

            // left
            <div
              key='4'
              style={{
                ...maskCommonStyle,
                top: offset.top,
                left: 0,
                width: offset.left,
                height: offset.bottom - offset.top,
              }}
            />,
          ]
        ) : (
          <div style={{ ...maskCommonStyle, top: 0, left: 0, right: 0, bottom: 0 }} />
        )}
      </div>
    );
  }
}
