export function findParent(
  externalId: string,
  nameMap: Map<string, string>
): { name: string; externalId: string } | null {
  let parentName: undefined | string = undefined;
  const lastDotIdx = externalId.lastIndexOf(".");

  let parentId: undefined | string = undefined;
  if (lastDotIdx > -1) {
    parentId = externalId.substring(0, lastDotIdx);
    parentName = nameMap.get(parentId);

    if (!parentName) {
      return null;
    }

    return {
      externalId: parentId,
      name: parentName,
    };
  }

  return null;
}
