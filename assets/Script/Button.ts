const { ccclass } = cc._decorator;

@ccclass
export default class Button extends cc.Component {
  onLoad() {
    this.node.on(
      cc.Node.EventType.TOUCH_END,
      () => {
        cc.tween(this.node)
          .to(0.1, {
            scale: 0.8,
          })
          .to(0.1, {
            scale: 1,
          })
          .start();
      },
      this.node
    );
  }
}
