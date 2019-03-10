import { ServiceInterface, SceneDef } from '../../interface';

export default class implements ServiceInterface {
  private list: { name: string; data: SceneDef }[];

  constructor(list: { name: string; data: SceneDef }[]) {
    this.list = list;
  }

  async getScene(name: string) {
    const res = this.list.find(d => d.name === name);
    return res && res.data;
  }
}
