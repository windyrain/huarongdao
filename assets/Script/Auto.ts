import { chessCount } from "./Map";

const mapping = new Map<number, string>(); // 数字和字母的映射表
mapping.set(0, "0");
mapping.set(1, "a");
mapping.set(2, "2");
mapping.set(3, "a");
mapping.set(4, "a");
mapping.set(5, "5");
mapping.set(6, "a");
mapping.set(7, "b");
mapping.set(8, "b");
mapping.set(9, "b");
mapping.set(10, "b");

function mapToString(map) {
  return map
    .map((item) => item.map((num) => mapping.get(num)).join(""))
    .join("");
}

function findMoveChess(arr: number[][]): number[] {
  const rows = 5;
  const cols = 4;
  let space = 0;

  // 定义上下左右四个方向的偏移量
  const directions: [number, number][] = [
    [0, 1], // 右
    [0, -1], // 左
    [1, 0], // 下
    [-1, 0], // 上
  ];

  const adjacentNums = new Set<number>(); // 使用 Set 存储结果

  // 遍历二维数组
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (space === 2) break;
      if (arr[i][j] === 0) {
        // 检查上下左右四个方向的元素
        for (const direction of directions) {
          const x = i + direction[0];
          const y = j + direction[1];
          if (x >= 0 && x < rows && y >= 0 && y < cols && arr[x][y] !== 0) {
            adjacentNums.add(arr[x][y]); // 使用 Set 的 add 方法添加唯一的数字
          }
        }
        space += 1;
      }
    }
  }

  return Array.from(adjacentNums); // 将 Set 转换为数组返回
}

export function auto({ hrdMap, operate }) {
  console.time();
  const memoryMaps = new Set();
  let queue = [{ hrdMap, operate }];

  while (queue.length > 0) {
    const current = queue.shift();
    const chessIds = findMoveChess(current.hrdMap);
    let nextMaps = [];

    chessIds.forEach((item) => {
      const result = autoMove(current, item);
      if (result.length > 0) {
        nextMaps = nextMaps.concat(result);
      }
    });

    for (let j = 0; j < nextMaps.length; j++) {
      const nextMap = nextMaps[j];

      const { hrdMap, operate } = nextMap;
      if (hrdMap && hrdMap[4][1] === 2 && hrdMap[4][2] === 2) {
        console.timeEnd();
        return { hrdMap, operate };
      }

      const mapStr = mapToString(hrdMap);
      if (!memoryMaps.has(mapStr)) {
        memoryMaps.add(mapStr);
        queue.push(nextMap);
      }
    }
  }
}

function deepCopy2DArray<T>(array: T[][]): T[][] {
  return array.map((subarray) => [...subarray]);
}

function autoMove({ hrdMap, operate }, chessId) {
  const flags = [false, false, false, false];
  const count = chessCount[chessId];
  // 上 右 下 左
  const counts = [count, count, count, count];
  const moveIndex = [[], [], [], []];

  for (let i = 0; i < hrdMap.length; i++) {
    for (let j = 0; j < hrdMap[i].length; j++) {
      if (hrdMap[i][j] === chessId) {
        // 上
        if (!hrdMap[i - 1] || hrdMap[i - 1][j] !== 0) {
          counts[0]--;
        } else {
          moveIndex[0].push([i, j]);
        }
        // 右
        if (hrdMap[i][j + 1] !== 0) {
          counts[1]--;
        } else {
          moveIndex[1].push([i, j]);
        }
        // 下
        if (!hrdMap[i + 1] || hrdMap[i + 1][j] !== 0) {
          counts[2]--;
        } else {
          moveIndex[2].push([i, j]);
        }
        // 左
        if (hrdMap[i][j - 1] !== 0) {
          counts[3]--;
        } else {
          moveIndex[3].push([i, j]);
        }
      }
    }
  }

  if (chessId === 2) {
    // 曹操
    flags[0] = counts[0] === 2;
    flags[1] = counts[1] === 2;
    flags[2] = counts[2] === 2;
    flags[3] = counts[3] === 2;
  } else if (chessId === 1 || chessId === 3 || chessId == 4 || chessId === 6) {
    // 张，马，赵，黄
    flags[0] = counts[0] === 1;
    flags[1] = counts[1] === 2;
    flags[2] = counts[2] === 1;
    flags[3] = counts[3] === 2;
  } else if (chessId === 5) {
    // 关羽
    flags[0] = counts[0] === 2;
    flags[1] = counts[1] === 1;
    flags[2] = counts[2] === 2;
    flags[3] = counts[3] === 1;
  } else {
    // 其他
    flags[0] = counts[0] === chessCount[chessId];
    flags[1] = counts[1] === chessCount[chessId];
    flags[2] = counts[2] === chessCount[chessId];
    flags[3] = counts[3] === chessCount[chessId];
  }

  const arr = [];

  flags.forEach((flag, index) => {
    if (flag) {
      const deepMap = deepCopy2DArray(hrdMap);
      const deepOperate = [...operate];

      if (index === 0) {
        deepOperate.push(`${chessId}_up`);
        for (let i = 0; i < moveIndex[0].length; i++) {
          const [moveI, moveJ] = moveIndex[0][i];
          if (chessId === 2 || [1, 3, 4, 6].includes(chessId)) {
            deepMap[moveI - 1][moveJ] = chessId;
            deepMap[moveI + 1][moveJ] = 0;
          } else {
            deepMap[moveI][moveJ] = 0;
            deepMap[moveI - 1][moveJ] = chessId;
          }
        }
      }

      if (index === 1) {
        deepOperate.push(`${chessId}_right`);

        for (let i = 0; i < moveIndex[1].length; i++) {
          const [moveI, moveJ] = moveIndex[1][i];
          if (chessId === 2 || chessId === 5) {
            deepMap[moveI][moveJ - 1] = 0;
            deepMap[moveI][moveJ + 1] = chessId;
          } else {
            deepMap[moveI][moveJ] = 0;
            deepMap[moveI][moveJ + 1] = chessId;
          }
        }
      }

      if (index === 2) {
        deepOperate.push(`${chessId}_down`);
        for (let i = 0; i < moveIndex[2].length; i++) {
          const [moveI, moveJ] = moveIndex[2][i];
          if (chessId === 2 || [1, 3, 4, 6].includes(chessId)) {
            deepMap[moveI - 1][moveJ] = 0;
            deepMap[moveI + 1][moveJ] = chessId;
          } else {
            deepMap[moveI][moveJ] = 0;
            deepMap[moveI + 1][moveJ] = chessId;
          }
        }
      }

      if (index === 3) {
        deepOperate.push(`${chessId}_left`);

        for (let i = 0; i < moveIndex[3].length; i++) {
          const [moveI, moveJ] = moveIndex[3][i];
          if (chessId === 2 || chessId === 5) {
            deepMap[moveI][moveJ - 1] = chessId;
            deepMap[moveI][moveJ + 1] = 0;
          } else {
            deepMap[moveI][moveJ] = 0;
            deepMap[moveI][moveJ - 1] = chessId;
          }
        }
      }

      arr.push({ hrdMap: deepMap, operate: deepOperate });
    }
  });

  return arr;
}
