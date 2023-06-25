const { ccclass, property } = cc._decorator;

type textdata = {
  role: number;
  content: string;
};
// 建立角色映射
let roleMap = new Map();
roleMap.set(1, { name: "曹操", url: "avator/avator_caocao" });
roleMap.set(2, { name: "关羽", url: "avator/avator_guanyu" });

@ccclass
export default class Dialog extends cc.Component {
  // LIFE-CYCLE CALLBACKS:
  @property(cc.Sprite)
  picSprite: cc.Sprite;
  @property(cc.Label)
  nameLabel: cc.Label;
  @property(cc.Label)
  textLabel: cc.Label;
  @property(cc.Node)
  container: cc.Node;
  @property(cc.Node)
  mask: cc.Node;

  textDataArr: textdata[]; // 文本对话数组

  textIndex: number; // 当前对话所在数组下标

  nowText: string;
  textEnd: boolean = true; // 当前文本是否已经播放完毕
  textTime: number = 0; // 播放总时长

  static isShow = false;

  onLoad() {
    this.init([
      { role: 1, content: "云长兄，为何拦我去路！" },
      {
        role: 2,
        content: "孟德兄，昔日情谊，斩颜良，杀文丑已报，这次我不会手下留情。",
      },
      { role: 1, content: "屏幕前的英雄，请动动小手，助我脱困吧！" },
    ]);

    // 初始化键盘输入监听
    this.container.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    this.mask.on(
      cc.Node.EventType.TOUCH_END,
      (e) => {
        e.preventDefault();
      },
      this
    );
  }
  // 键盘按下事件
  onClick() {
    this.nextTextData();
  }

  init(textDataArr: textdata[]) {
    const hrdDialog = localStorage.getItem("@xf/hrdDialog") || 0;

    if (hrdDialog) {
      this.node.active = false; // 不显示对话框
      Dialog.isShow = false;
      return;
    }

    this.nowText = null;
    this.textEnd = true;

    this.textIndex = -1;
    this.textDataArr = textDataArr;
    this.node.active = true; // 显示对话框
    Dialog.isShow = true;
    this.nextTextData();
  }

  // 判断执行下一句对话
  nextTextData() {
    // 如果当前没有播放完毕，不执行下一句
    if (!this.textEnd) return;

    if (++this.textIndex < this.textDataArr.length) {
      // 说明数组中还有对话
      this.setTextData(this.textDataArr[this.textIndex]);
      this.textEnd = false;
    } else {
      // 关闭对话框
      this.closeDialog();
    }
  }

  // 设置当前对话
  setTextData(textdata: textdata) {
    this.nameLabel.string = roleMap.get(textdata.role).name;
    this.textLabel.string = "";
    this.nowText = textdata.content;

    // 加载文件夹下资源
    cc.loader.loadRes(
      roleMap.get(textdata.role).url,
      cc.SpriteFrame,
      (err, texture) => {
        this.picSprite.spriteFrame = texture;
      }
    );
  }

  // 关闭对话框
  closeDialog() {
    this.node.active = false;
    Dialog.isShow = false;
    localStorage.setItem("@xf/hrdDialog", `${Date.now()}`);
  }

  update(dt) {
    if (!this.nowText) return;
    this.textTime += dt;
    if (this.textTime >= 0.1) {
      if (this.textLabel.string.length < this.nowText.length) {
        // 还要播放
        this.textLabel.string = this.nowText.slice(
          0,
          this.textLabel.string.length + 1
        );
      } else {
        this.textEnd = true; //播放完毕
        this.nowText = "";
      }
      this.textTime = 0;
    }
  }
}
