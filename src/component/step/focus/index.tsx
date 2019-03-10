import { h, Component } from 'preact';
import { StepComponentProps, SceneStepDef } from '../../../interface';
import { Mask } from '../../mask';

type SimplePositionType = SceneStepDef['focus']['position'];

type SimpleAnchorType = {
  [key in SimplePositionType]: {
    anchor: { x: number; y: number };
    offset: { x: string; y: string };
  }
};

const makePosition = (height: number, width: number): SimpleAnchorType => ({
  top: {
    anchor: {
      x: width / 2,
      y: 0,
    },
    offset: {
      x: '-50%',
      y: '-100%',
    },
  },
  left: {
    anchor: {
      x: 0,
      y: height / 2,
    },
    offset: {
      x: '-100%',
      y: '-50%',
    },
  },
  right: {
    anchor: {
      x: width,
      y: height / 2,
    },
    offset: {
      x: '0',
      y: '-50%',
    },
  },
  bottom: {
    anchor: {
      x: width / 2,
      y: height,
    },
    offset: {
      x: '-50%',
      y: '0',
    },
  },
  bottomLeft: {
    anchor: {
      x: 0,
      y: height,
    },
    offset: {
      x: '-80%',
      y: '0',
    },
  },
});

type Props = StepComponentProps['focus'];

const DEFAULT_POSITION = 'left';

export class StepFocus extends Component<Props> {
  /** 获取聚焦点的位置 */
  getFocusArea() {
    const { selector } = this.props.data;

    const selectorList = typeof selector === 'string' ? [selector] : selector;

    const area: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    } = {
      top: null,
      right: null,
      bottom: null,
      left: null,
    };

    // selector 是数组，要循环计算所有 selector 占用的最大区域
    selectorList.forEach((s, index) => {
      const targetDom = document.querySelector(s);
      if (!targetDom) return null;

      const currentArea = targetDom.getBoundingClientRect();

      if (index === 0) {
        area.top = currentArea.top;
        area.right = currentArea.right;
        area.bottom = currentArea.bottom;
        area.left = currentArea.left;
      } else {
        area.top = Math.min(area.top, currentArea.top);
        area.right = Math.max(area.right, currentArea.right);
        area.left = Math.min(area.left, currentArea.left);
        area.bottom = Math.max(area.bottom, currentArea.bottom);
      }
    });

    return area;
  }

  render() {
    const { data } = this.props;
    const { position = DEFAULT_POSITION } = data;

    const focusArea = this.getFocusArea();

    /**
     * 这里的位置计算用了两层节点。外层是 anchor，内层是 offset。
     * anchor 绝对定位配合 offset 位置偏移来实现 8 个定位位置。
     */
    const posDef = makePosition(focusArea.bottom - focusArea.top, focusArea.right - focusArea.left)[
      position
    ];

    const anchorStyle = {
      position: 'fixed',
      zIndex: '1000',
      top: focusArea.top + posDef.anchor.y,
      left: focusArea.left + posDef.anchor.x,
    };

    const offsetStyle = {
      transform: `translate(${posDef.offset.x}, ${posDef.offset.y})`,
    };

    const contentStyle = {
      position: 'relative',
      padding: '16px',
      background: '#fff',
      width: data.width,
      borderRadius: '4px',
      pointerEvents: 'initial',

      ...(position === 'top' && { transform: `translateY(-16px)` }),
      ...(position === 'left' && { marginRight: '16px' }),
      ...(position === 'right' && { marginLeft: '16px' }),
      ...(position === 'bottom' && { marginTop: '16px' }),
      ...(position === 'bottomLeft' && { marginTop: '16px' }),
    };

    /** 小箭头样式 */
    const arrowStyle = {
      content: '',
      position: 'absolute',
      height: '8px',
      width: '8px',
      background: '#fff',
      transform: 'rotate(45deg)',

      ...(position === 'top' && {
        bottom: '-4px',
        left: 'calc(50% - 4px)',
      }),

      ...(position === 'left' && {
        top: 'calc(50% - 4px)',
        right: '-4px',
      }),

      ...(position === 'right' && {
        top: 'calc(50% - 4px)',
        left: '-4px',
      }),

      ...(position === 'bottom' && {
        top: '-4px',
        left: 'calc(50% - 4px)',
      }),

      ...(position === 'bottomLeft' && {
        top: '-4px',
        left: 'calc(80% - 4px)',
      }),
    };

    const footerStyle = {
      marginTop: '8px',
      textAlign: 'right',
    };

    return (
      <div>
        <Mask area={focusArea} />
        <div data-name='anchor' style={anchorStyle}>
          {/* 这个 div 仅用于 offset 定位 */}
          <div data-name='offset' style={offsetStyle}>
            <div data-name='content' style={contentStyle}>
              <div style={arrowStyle} />
              <div dangerouslySetInnerHTML={{ __html: data.content }} />

              {this.props.progressChild && (
                <footer style={footerStyle}>{this.props.progressChild}</footer>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
