exports.splitArrayIntoGroups = (array, n) => {
  const output = [];

  // initiate n empty arrays
  for (let i = 0; i < n; i++) {
    output.push([]);
  }

  for (let i = 0, len = array.length, group = 0; i < len; i++) {
    if (group === n) group = 0;

    output[group].push(array[i]);

    group++;
  }

  return output;
};
