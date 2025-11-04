//https://stats-visualiser.onrender.com/location?topic=topic_id pour avoir la liste des loc pour 1 topic
//https://stats-visualiser.onrender.com/location/geo_id?topic=topic_id pour accéder à une thématique via son ID associé à une loc en particulier

import type { geoTopicBranch } from "../types/dataTypes";

export async function GetLocalisationsByTopic(
  topic_id: string
): Promise<geoTopicBranch> {
  try {
    const response = await fetch(
      `https://stats-visualiser.onrender.com/location?topic=${topic_id}`
    );
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topic's details.");
  }
}

export async function GetGeolocByGeoByTopic(
  topic_id: string,
  geo_id: string
): Promise<geoTopicBranch> {
  try {
    const response = await fetch(
      `https://stats-visualiser.onrender.com/location/${geo_id}?topic=${topic_id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topic's details.");
  }
}
