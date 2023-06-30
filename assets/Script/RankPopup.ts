const { ccclass } = cc._decorator;

@ccclass
export default class RankPopup extends cc.Component {
  text;

  protected onLoad(): void {
    this.text = cc.find("text", this.node).getComponent(cc.Label);

    cc.find("mask", this.node).on(cc.Node.EventType.TOUCH_END, (e) => {
      if (e.preventDefault) e.preventDefault();
      this.node.active = false;
    });
  }

  protected onEnable(): void {
    if (this.text) {
      const str = localStorage.getItem("@xf/hrdScore") || "0";
      this.text.string = `${str}分`;
    }
  }
}
