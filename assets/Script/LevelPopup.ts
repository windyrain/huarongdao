import { maps } from "./Map";

const { ccclass, property } = cc._decorator;

let chooseLevelEvent = (index: number) => {};
let randomLevelEvent = () => {};

export function bindChooseLevelEvent(event) {
  chooseLevelEvent = event;
}

export function bindRandomLevelEvent(event) {
  randomLevelEvent = event;
}

@ccclass
export default class LevelPopup extends cc.Component {
  @property(cc.Prefab)
  prefab: null;

  onLoad() {
    for (let i = 0; i < maps.length + 1; i++) {
      const itemPrefab = cc.instantiate(this.prefab);
      itemPrefab.y = 400 - 150 * i;
      if (i === maps.length) {
        cc.find("text", itemPrefab).getComponent(cc.Label).string = "随机关卡";
        itemPrefab.on(cc.Node.EventType.TOUCH_END, () => {
          randomLevelEvent();
          this.node.active = false;
        });
      } else {
        cc.find("text", itemPrefab).getComponent(cc.Label).string =
          maps[i].name;
        itemPrefab.on(cc.Node.EventType.TOUCH_END, () => {
          chooseLevelEvent(i);
          this.node.active = false;
        });
      }

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
