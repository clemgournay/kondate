export const FindIndexByPropValue = (arr: any, prop: string, value: any): number => {
  let i = 0, found = false;
  while(!found && i  < arr.length) {
    if (arr[i][prop] === value) found = true;
    else i++;
  }
  return (found) ? i : -1;
}

export const FindItemByPropValue = (arr: any, prop: string, value: any): any | null => {
  const index = FindIndexByPropValue(arr, prop, value);
  return (index >= 0) ? arr[index] : null;
}

export const RemoveMultipleItems = (arr: Array<any>, itemsToRemove: Array<number>): Array<any> => {
  for (let i = itemsToRemove.length -1; i >= 0; i--) arr.splice(itemsToRemove[i], 1);
  return arr;
}
