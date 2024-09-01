/**
 * 插入排序法（升序）
 * @param {Array} arr 要排序的数组
 * @returns
 */
const insertSort = (arr) => {
  // 从数组的第二个元素开始作为索引
  for (let i = 1; i < arr.length; i++) {
    // 从遍历到的索引开始往前比较插入
    for (let j = i; j >= 0; j--) {
      // 如果前一个元素大于当前元素，交换位置
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      } else {
        break;
      }
    }
  }
  return arr;
};
