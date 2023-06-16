const { ccclass } = cc._decorator;

let confirmEvent = () => {};

export function bindHistoryConfirmEvent(event) {
  confirmEvent = event;
}

@ccclass
export default class HistoryPopup extends cc.Component {
  onLoad() {
    cc.find("confirm/confirm-btn", this.node).on(
      cc.Node.EventType.TOUCH_END,
      () => {
        confirmEvent();
        this.node.active = false;
      }
    );
    cc.find("confirm/cancel-btn", this.node).on(
      cc.Node.EventType.TOUCH_END,
      () => {
        localStorage.removeItem("@xf/historyGame");
        this.node.active = false;
      }
    );
  }
}
