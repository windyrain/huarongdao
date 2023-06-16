import { maps } from "./Map";

const { ccclass, property } = cc._decorator;

let chooseLevelEvent = (index: number) => {};

export function bindChooseLevelEvent(event) {
  chooseLevelEvent = event;
}

@ccclass
export default class LevelPopup extends cc.Component {
  @property(cc.Prefab)
  prefab: null;

  onLoad() {
    for (let i = 0; i < maps.length; i++) {
      const itemPrefab = cc.instantiate(this.prefab);
      itemPrefab.y = 400 - 150 * i;
      cc.find("text", itemPrefab).getComponent(cc.Label).string = maps[i].name;
      itemPrefab.on(cc.Node.EventType.TOUCH_END, () => {
        chooseLevelEvent(i);
        this.node.active = false;
      });
      this.node.addChild(itemPrefab);
    }

    cc.find("mask", this.node).on(cc.Node.EventType.TOUCH_END, () => {
      this.node.active = false;
    });
  }

  onEnable() {
    let levels = [];
    try {
      levels = JSON.parse(localStorage.getItem("@xf/levels") || "[]");
    } catch (e) {}
    for (let i = 0; i < maps.length; i++) {
      if (levels.includes(i)) {
        cc.find("successText", this.node.children[i + 2]).active = true;
      }
    }
  }
}
