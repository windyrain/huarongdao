import { auto } from "./Auto";
import { bindHistoryConfirmEvent } from "./HistoryPopup";
import {
  bindSuccessEvent,
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  checkSuccess,
  computePosition,
  getMap,
  getMapInfo,
  maps,
  setMap,
  setMapIndex,
  startGame,
} from "./Map";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
  mapIndex = 0;

  @property(cc.Label)
  title: cc.Label = null;

  @property(cc.Node)
  star: cc.Node = null;

  @property(cc.Node)
  successPopup = null;

  @property(cc.Node)
  historyPopup = null;

  @property(cc.Node)
  btnReset = null;

  @property(cc.Node)
  btnTip = null;

  isCompute = false;

  historyInfo = {
    mapIndex: 0,
    hrdMap: [],
    position: {},
  };

  onLoad() {
    cc.find("mask", this.successPopup).on(cc.Node.EventType.TOUCH_END, () => {
      this.successPopup.active = false;
      startGame(this.mapIndex);
      this.setInfo();
    });
    cc.find("next", this.successPopup).on(cc.Node.EventType.TOUCH_END, () => {
      if (this.mapIndex < maps.length - 1) {
        this.mapIndex += 1;
      }
      this.successPopup.active = false;
      startGame(this.mapIndex);
      this.setInfo();
    });

    bindSuccessEvent(() => {
      if (this.mapIndex === maps.length - 1) {
        cc.loader.loadRes("successPopup1", cc.SpriteFrame, (err, texture) => {
          cc
            .find("next", this.successPopup)
            .getComponent(cc.Sprite).spriteFrame = texture;
          this.successPopup.active = true;
        });
      } else {
        this.successPopup.active = true;
      }
    });

    // 历史记录继续功能
    bindHistoryConfirmEvent(() => {
      const { mapIndex, hrdMap } = this.historyInfo;
      const { map, name, level } = getMapInfo(mapIndex);
      const currentMap = hrdMap || map;
      const currentPosition = computePosition(currentMap);
      setMap(currentMap);
      setMapIndex(mapIndex);
      this.mapIndex = mapIndex;
      this.title.string = name;
      this.star.width = 30 * level;
      Object.keys(currentPosition).forEach((item) => {
        const [x, y, z] = currentPosition[item];
        cc.find(`chess/${item}`, this.node).position = cc.v3(x, y, z);
      });
    });

    // 历史记录功能
    const result = localStorage.getItem("@xf/historyGame");

    if (result) {
      try {
        const { mapIndex, hrdMap, position } = JSON.parse(result);
        if (typeof mapIndex !== "undefined") {
          this.historyPopup.active = true;
          this.historyInfo = {
            mapIndex,
            hrdMap,
            position,
          };
        }
      } catch (e) {}
    }

    startGame(this.mapIndex);
    this.setInfo();

    this.btnReset.on(cc.Node.EventType.TOUCH_END, this.onReset, this);
    this.btnTip.on(cc.Node.EventType.TOUCH_END, this.onTip, this);
  }

  onReset() {
    startGame(this.mapIndex);
    this.setInfo();
    checkSuccess();
  }

  onTip() {
    if (this.isCompute) {
      return;
    }
    this.isCompute = true;
    const result = auto({ hrdMap: getMap(), operate: [] });
    const chessMap = {
      1: cc.find("chess/zhangfei", this.node),
      2: cc.find("chess/caocao", this.node),
      3: cc.find("chess/machao", this.node),
      4: cc.find("chess/huangzhong", this.node),
      5: cc.find("chess/guanyu", this.node),
      6: cc.find("chess/zhaoyun", this.node),
      7: cc.find("chess/shibing0", this.node),
      8: cc.find("chess/shibing1", this.node),
      9: cc.find("chess/shibing2", this.node),
      10: cc.find("chess/shibing3", this.node),
    };
    const { operate } = result;
    let i = 0;
    setInterval(() => {
      if (i < (operate.length < 20 ? operate.length / 2 : 10)) {
        const [chessId, direction] = operate[i].split("_");
        switch (direction) {
          case "left":
            if (canMoveLeft(Number(chessId))) {
              chessMap[chessId].x -= 160;
              checkSuccess();
            }
            break;
          case "right":
            if (canMoveRight(Number(chessId))) {
              chessMap[chessId].x += 160;
              checkSuccess();
            }
            break;
          case "up":
            if (canMoveUp(Number(chessId))) {
              chessMap[chessId].y += 160;
              checkSuccess();
            }
            break;
          case "down":
            if (canMoveDown(Number(chessId))) {
              chessMap[chessId].y -= 160;
              checkSuccess();
            }
            break;
        }
        i++;
      } else {
        this.isCompute = false;
      }
    }, 200);
  }

  setInfo() {
    const { name, level, map } = getMapInfo(this.mapIndex);
    this.title.string = name;
    this.star.width = 30 * level;
    const position = computePosition(map);
    Object.keys(position).forEach((item) => {
      const [x, y, z] = position[item];
      console.log("name", item, cc.find(`chess/${item}`, this.node));
      cc.find(`chess/${item}`, this.node).position = cc.v3(x, y, z);
    });
  }
}
