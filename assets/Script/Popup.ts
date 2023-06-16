const { ccclass } = cc._decorator;

@ccclass
export default class Popup extends cc.Component {
  protected onEnable(): void {
    this.node.opacity = 0;
    cc.tween(this.node).to(0.3, { opacity: 255 }).start();
  }
}
