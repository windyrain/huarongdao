import Dialog from "./Dialog";
import {
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  canMoveDown,
  checkSuccess,
} from "./Map";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Chess extends cc.Component {
  private startPosition: cc.Vec2 = cc.Vec2.ZERO;
  private selectedNode: cc.Node = null;

  @property(cc.Integer)
  chessId = 0;

  onLoad() {
    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
    this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
  }

  private onTouchBegan(event: cc.Event.EventTouch): boolean {
    this.startPosition = event.getLocation();
    this.selectedNode = event.getCurrentTarget();
    return true;
  }

  private onTouchMoved(event: cc.Event.EventTouch) {
    if (!this.selectedNode) {
      return;
    }
    // event.stopPropagation();
  }

  private onTouchEnd(event: cc.Event.EventTouch) {
    const touchLocation = event.getLocation();
    const distanceX = touchLocation.x - this.startPosition.x;
    const distanceY = touchLocation.y - this.startPosition.y;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (distanceX > 0) {
        this.moveRight();
      } else {
        this.moveLeft();
      }
    } else {
      if (distanceY > 0) {
        this.moveUp();
      } else {
        this.moveDown();
      }
    }

    this.startPosition = touchLocation;
  }

  private moveRight() {
    if (Dialog.isShow) return;
    if (canMoveRight(this.chessId)) {
      this.node.x += 160;
      checkSuccess();
    }
  }

  private moveLeft() {
    if (Dialog.isShow) return;
    if (canMoveLeft(this.chessId)) {
      this.node.x -= 160;
      checkSuccess();
    }
  }

  private moveUp() {
    if (Dialog.isShow) return;
    if (canMoveUp(this.chessId)) {
      this.node.y += 160;
      checkSuccess();
    }
  }

  private moveDown() {
    if (Dialog.isShow) return;
    if (canMoveDown(this.chessId)) {
      this.node.y -= 160;
      checkSuccess();
    }
  }
}
