import { createApp } from '../src';

const mockData = {
  a: {
    steps: [
      // {
      //   type: 'notice',
      //   content: 'hello',
      //   topOffset: -200,
      // },
      // {
      //   type: 'focus',
      //   content: 'focus',
      //   selector: '#m1',
      //   position: 'right',
      // },
      // {
      //   type: 'carousel',
      //   children: [
      //     'https://gw.alipayobjects.com/zos/rmsportal/OJfwWtukLTxNjhfEjIGj.png',
      //     'https://gw.alipayobjects.com/zos/rmsportal/KzpFwvUGQwxSorGgMgRa.png',
      //   ],
      //   topOffset: -50,
      // },
      {
        type: 'focus',
        content: 'focus',
        selector: '#m2',
        position: 'top',
      },
      {
        type: 'focus',
        content: 'focus',
        selector: ['#m1', '#m2'],
        position: 'right',
      },
    ],
  },
};

const app = createApp({
  service: {
    getScene: async (name: string) => {
      return mockData[name];
    },
  },
});

app('a').start();
