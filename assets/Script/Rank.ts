export const isSupportRank = () => {
  const global: any = window;
  // 4399 平台
  if (global.h5api) {
    return true;
  }

  return true;
};

export const showRankList = () => {
  const global: any = window;
  // 4399 平台
  if (global.h5api) {
    global.h5api.showRankList();
  } else {
    cc.find("Canvas/rankPopup").active = true;
  }
};

export const submitRankScore = (score: number, callback: () => void) => {
  const global: any = window;
  // 4399 平台
  if (global.h5api) {
    global.h5api.submitRankScore(763, score, (data) => {
      if (data.code === 1000) {
        callback();
      }
    });
  } else {
    callback();
  }
};
