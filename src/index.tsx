import { h, render } from 'preact';
import { AppConfig, TopicType } from './interface';
import { App } from './app';
import { PubCenter } from './pub';
import { normalDebug } from './debug';

export * from './interface';
export * from './service';

function insertMountRoot(id: string = 'user-onboarding-root-' + new Date().valueOf()) {
  const root = document.createElement('div');
  root.id = id;

  document.body.appendChild(root);

  return root;
}

export function createApp(config: AppConfig) {
  const mount = insertMountRoot();

  return (name: string) => {
    const pub = new PubCenter();
    let renderRoot: Element;

    const api = {
      /** 启动 */
      start: () => {
        normalDebug.log('Onboarding start: name=%s, mount=%s', name, mount.id);

        (async () => {
          const sceneData = await config.service.getScene(name);

          normalDebug.info(
            'Onboarding data ready: name=%s, stepCnt=%s',
            name,
            sceneData.steps.length
          );

          renderRoot = render(
            <App
              sceneData={sceneData}
              onNextStep={(...args) => pub.publish('nextStep', ...args)}
              onFinish={() => pub.publish('finish')}
            />,
            mount
          );
        })();

        return api;
      },

      /** 停止 */
      stop: () => {
        // How to destroy root Preact node
        // @see https://github.com/developit/preact/issues/1151
        render(null, mount, renderRoot);

        normalDebug.log('Onboarding stop');
      },

      /** 监听事件 */
      on: (topic: TopicType, handler: (topic: TopicType, data: any) => void) => {
        pub.subscribe(topic, handler);
        return api;
      },

      /** 取消监听事件 */
      off: (topic: TopicType, handler: (topic: TopicType, data: any) => void) => {
        pub.unSubscribe(topic, handler);
        return api;
      },
    };

    return api;
  };
}
