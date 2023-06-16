const chessIdMap = {
  ZHANGFEI: 1,
  CAOCAO: 2,
  MACHAO: 3,
  HUANGZHONG: 4,
  GUANYU: 5,
  ZHAOYUN: 6,
  SHIBING0: 7,
  SHIBING1: 8,
  SHIBING2: 9,
  SHIBING3: 10,
  ZHANGAI: 11,
};

export const computePosition = (map) => {
  const lastPosition: Record<string, number[]> = {};

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const name = getKey(map[i][j]);

      if (name) {
        lastPosition[name] = [
          [-320, -160, 0, 160][j],
          [320, 160, 0, -160, -320][i],
          0,
        ];
      }
    }
  }

  lastPosition.caocao[0] -= 160;
  lastPosition.guanyu[0] -= 160;

  return lastPosition;
};

export const maps = [
  {
    name: "小试牛刀",
    level: 1,
    map: [
      [1, 4, 6, 3],
      [1, 4, 6, 3],
      [5, 5, 2, 2],
      [7, 8, 2, 2],
      [9, 10, 0, 0],
    ],
  },
  {
    name: "捷足先登",
    level: 2,
    map: [
      [
        chessIdMap.SHIBING0,
        chessIdMap.CAOCAO,
        chessIdMap.CAOCAO,
        chessIdMap.SHIBING1,
      ],
      [
        chessIdMap.SHIBING2,
        chessIdMap.CAOCAO,
        chessIdMap.CAOCAO,
        chessIdMap.SHIBING3,
      ],
      [0, chessIdMap.GUANYU, chessIdMap.GUANYU, 0],
      [
        chessIdMap.ZHANGFEI,
        chessIdMap.MACHAO,
        chessIdMap.HUANGZHONG,
        chessIdMap.ZHAOYUN,
      ],
      [
        chessIdMap.ZHANGFEI,
        chessIdMap.MACHAO,
        chessIdMap.HUANGZHONG,
        chessIdMap.ZHAOYUN,
      ],
    ],
  },
  {
    name: "雨声淅沥",
    level: 3,
    map: [
      [
        chessIdMap.ZHANGFEI,
        chessIdMap.CAOCAO,
        chessIdMap.CAOCAO,
        chessIdMap.SHIBING0,
      ],
      [
        chessIdMap.ZHANGFEI,
        chessIdMap.CAOCAO,
        chessIdMap.CAOCAO,
        chessIdMap.SHIBING1,
      ],
      [
        chessIdMap.MACHAO,
        chessIdMap.GUANYU,
        chessIdMap.GUANYU,
        chessIdMap.ZHAOYUN,
      ],
      [chessIdMap.MACHAO, chessIdMap.HUANGZHONG, 0, chessIdMap.ZHAOYUN],
      [chessIdMap.SHIBING2, chessIdMap.HUANGZHONG, 0, chessIdMap.SHIBING3],
    ],
  },
  {
    name: "将拥曹营",
    level: 4,
    map: [
      [0, chessIdMap.CAOCAO, chessIdMap.CAOCAO, 0],
      [
        chessIdMap.MACHAO,
        chessIdMap.CAOCAO,
        chessIdMap.CAOCAO,
        chessIdMap.HUANGZHONG,
      ],
      [
        chessIdMap.MACHAO,
        chessIdMap.ZHANGFEI,
        chessIdMap.ZHAOYUN,
        chessIdMap.HUANGZHONG,
      ],
      [
        chessIdMap.SHIBING0,
        chessIdMap.ZHANGFEI,
        chessIdMap.ZHAOYUN,
        chessIdMap.SHIBING1,
      ],
      [
        chessIdMap.GUANYU,
        chessIdMap.GUANYU,
        chessIdMap.SHIBING2,
        chessIdMap.SHIBING3,
      ],
    ],
  },
  {
    name: "横刀立马",
    level: 4,
    map: [
      [
        chessIdMap.ZHANGFEI,
        chessIdMap.CAOCAO,
        chessIdMap.CAOCAO,
        chessIdMap.MACHAO,
      ],
      [
        chessIdMap.ZHANGFEI,
        chessIdMap.CAOCAO,
        chessIdMap.CAOCAO,
        chessIdMap.MACHAO,
      ],
      [
        chessIdMap.HUANGZHONG,
        chessIdMap.GUANYU,
        chessIdMap.GUANYU,
        chessIdMap.ZHAOYUN,
      ],
      [
        chessIdMap.HUANGZHONG,
        chessIdMap.SHIBING0,
        chessIdMap.SHIBING1,
        chessIdMap.ZHAOYUN,
      ],
      [chessIdMap.SHIBING2, 0, 0, chessIdMap.SHIBING3],
    ],
  },
];

function getKey(chessId) {
  return {
    1: "zhangfei",
    2: "caocao",
    3: "machao",
    4: "huangzhong",
    5: "guanyu",
    6: "zhaoyun",
    7: "shibing0",
    8: "shibing1",
    9: "shibing2",
    10: "shibing3",
  }[chessId];
}

export const chessCount = {
  1: 2,
  2: 4,
  3: 2,
  4: 2,
  5: 2,
  6: 2,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
};

let mapIndex, map, position;

export function startGame(mIndex) {
  mapIndex = mIndex;
  map = JSON.parse(JSON.stringify(maps[mIndex].map));
  position = computePosition(map);
}

export function setMapIndex(i) {
  mapIndex = i;
}
export function setMap(m) {
  map = m;
  position = computePosition(m);
}

export function getMap() {
  return map;
}

export function getMapInfo(mapIndex) {
  return maps[mapIndex];
}

export function canMoveRight(chessId) {
  let flag = false;
  let count = chessCount[chessId];
  let moveIndex = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === chessId) {
        if (map[i][j + 1] !== 0) {
          count--;
        } else {
          moveIndex.push([i, j]);
        }
      }
    }
  }

  if (chessId === 2 && count === 2) {
    // 曹操
    flag = true;
  } else if (chessId === 5 && count === 1) {
    // 关羽
    flag = true;
  } else {
    // 其他
    flag = count === chessCount[chessId];
  }

  if (flag) {
    for (let i = 0; i < moveIndex.length; i++) {
      const [moveI, moveJ] = moveIndex[i];
      if (chessId === 2 || chessId === 5) {
        map[moveI][moveJ - 1] = 0;
        map[moveI][moveJ + 1] = chessId;
      } else {
        map[moveI][moveJ] = 0;
        map[moveI][moveJ + 1] = chessId;
      }
    }
    position[getKey(chessId)][0] += 160;
  }

  return flag;
}

export function canMoveLeft(chessId) {
  let flag = false;
  let count = chessCount[chessId];
  let moveIndex = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === chessId) {
        if (map[i][j - 1] !== 0) {
          count--;
        } else {
          moveIndex.push([i, j]);
        }
      }
    }
  }

  if (chessId === 2 && count === 2) {
    // 曹操
    flag = true;
  } else if (chessId === 5 && count === 1) {
    // 关羽
    flag = true;
  } else {
    // 其他
    flag = count === chessCount[chessId];
  }

  if (flag) {
    for (let i = 0; i < moveIndex.length; i++) {
      const [moveI, moveJ] = moveIndex[i];
      if (chessId === 2 || chessId === 5) {
        map[moveI][moveJ - 1] = chessId;
        map[moveI][moveJ + 1] = 0;
      } else {
        map[moveI][moveJ] = 0;
        map[moveI][moveJ - 1] = chessId;
      }
    }
    position[getKey(chessId)][0] -= 160;
  }

  return flag;
}

export function canMoveUp(chessId) {
  let flag = false;
  let count = chessCount[chessId];
  let moveIndex = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === chessId) {
        if (!map[i - 1] || map[i - 1][j] !== 0) {
          count--;
        } else {
          moveIndex.push([i, j]);
        }
      }
    }
  }

  if (chessId === 2 && count === 2) {
    // 曹操
    flag = true;
  } else if ([1, 3, 4, 6].includes(chessId) && count === 1) {
    // 张，赵，马，黄
    flag = true;
  } else {
    // 其他
    flag = count === chessCount[chessId];
  }

  if (flag) {
    for (let i = 0; i < moveIndex.length; i++) {
      const [moveI, moveJ] = moveIndex[i];
      if (chessId === 2 || [1, 3, 4, 6].includes(chessId)) {
        map[moveI - 1][moveJ] = chessId;
        map[moveI + 1][moveJ] = 0;
      } else {
        map[moveI][moveJ] = 0;
        map[moveI - 1][moveJ] = chessId;
      }
    }
    position[getKey(chessId)][1] += 160;
  }

  return flag;
}

export function canMoveDown(chessId) {
  let flag = false;
  let count = chessCount[chessId];
  let moveIndex = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === chessId) {
        if (!map[i + 1] || map[i + 1][j] !== 0) {
          count--;
        } else {
          moveIndex.push([i, j]);
        }
      }
    }
  }

  if (chessId === 2 && count === 2) {
    // 曹操
    flag = true;
  } else if ([1, 3, 4, 6].includes(chessId) && count === 1) {
    // 张，赵，马，黄
    flag = true;
  } else {
    // 其他
    flag = count === chessCount[chessId];
  }

  if (flag) {
    for (let i = 0; i < moveIndex.length; i++) {
      const [moveI, moveJ] = moveIndex[i];
      if (chessId === 2 || [1, 3, 4, 6].includes(chessId)) {
        map[moveI - 1][moveJ] = 0;
        map[moveI + 1][moveJ] = chessId;
      } else {
        map[moveI][moveJ] = 0;
        map[moveI + 1][moveJ] = chessId;
      }
    }
    position[getKey(chessId)][1] -= 160;
  }

  return flag;
}

let successCallback = () => {};

export function checkSuccess() {
  if (
    (map[5] && map[5][1] === 2) ||
    (!map[5] && map[4][1] === 2 && map[4][2] === 2)
  ) {
    successCallback();
    localStorage.setItem(
      "@xf/historyGame",
      JSON.stringify({
        mapIndex: mapIndex + 1 === maps.length ? mapIndex : mapIndex + 1,
        hrdMap: null,
        position: null,
      })
    );
    const levelsStr = localStorage.getItem("@xf/levels");
    if (!levelsStr) {
      localStorage.setItem("@xf/levels", JSON.stringify([mapIndex]));
    } else {
      try {
        const levels = JSON.parse(levelsStr);
        if (!levels.includes(mapIndex)) {
          levels.push(mapIndex);
          localStorage.setItem("@xf/levels", JSON.stringify(levels));
        }
      } catch (e) {
        localStorage.setItem("@xf/levels", JSON.stringify([mapIndex]));
      }
    }
  } else {
    localStorage.setItem(
      "@xf/historyGame",
      JSON.stringify({
        mapIndex,
        hrdMap: map,
        position,
      })
    );
  }
}

export function bindSuccessEvent(callback: () => void) {
  successCallback = callback;
}
