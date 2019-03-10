import { TopicType, PubCenterInterface, TopicHandler } from '../interface';

/** 订阅发布中心 */
export class PubCenter implements PubCenterInterface {
  private handlerMap: { [topic in TopicType]?: TopicHandler[] } = {};

  /** 订阅 */
  subscribe(topic: TopicType, handler: TopicHandler) {
    if (!this.handlerMap[topic]) {
      this.handlerMap[topic] = [];
    }

    const handlers = this.handlerMap[topic];

    if (handlers.indexOf(handler) < 0) {
      handlers.push(handler);
    }

    return this;
  }

  /** 发布 */
  publish(topic: TopicType, data?: any) {
    const handlers = this.handlerMap[topic];

    if (handlers) {
      handlers.forEach(handler => {
        handler(topic, data);
      });
    }

    return this;
  }

  /** 取消订阅 */
  unSubscribe(topic: TopicType, handler: TopicHandler) {
    const handlers = this.handlerMap[topic];

    if (handlers) {
      this.handlerMap[topic] = handlers.filter(h => h !== handler);
    }

    return this;
  }
}
