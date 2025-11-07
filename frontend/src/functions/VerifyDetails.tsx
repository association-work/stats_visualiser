import type { topicBranch } from "../types/dataTypes";

export function VerifyDetails(
  currentBranch: topicBranch,
  topicIsOk: boolean,
  setTopicIsOk: React.Dispatch<React.SetStateAction<boolean>>
) {
  // vérification de l'Id pour enlever les fakes données
  if (currentBranch) {
    if (currentBranch.id.includes("0_")) {
      setTopicIsOk(false);
    }
  }
  if (currentBranch.children) {
    currentBranch.children.forEach((element) => {
      if (element.id.includes("0_")) {
        setTopicIsOk(false);
      }
    });
  }

  // vérification de l'unité pour éviter les calculs inutiles
  if (currentBranch.unit) {
    if (currentBranch.unit.includes("%") || currentBranch.unit.includes("/")) {
      setTopicIsOk(false);
    }
  }
  if (currentBranch.children) {
    currentBranch.children.forEach((element) => {
      if (element.unit) {
        if (element.unit.includes("%") || element.unit.includes("/")) {
          setTopicIsOk(false);
        }
      }
    });
  }
  return topicIsOk;
}
