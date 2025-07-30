//https://stats-visualiser.onrender.com/topic pour avoir la liste des thématiques, limités à 2 niveaux
//https://stats-visualiser.onrender.com/topic/topic_id pour accéder à une thématique et ses descendants directs via son ID

import type { topicBranch } from "../types/dataTypes";

export async function GetTopics() {
  try {
    const response = await fetch("https://stats-visualiser.onrender.com/topic");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics' data.");
  }
}

export async function GetTopic(id: string): Promise<topicBranch> {
  try {
    const response = await fetch(
      `https://stats-visualiser.onrender.com/topic/${id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topic's details.");
  }
}
