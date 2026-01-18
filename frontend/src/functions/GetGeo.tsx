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
  const loc_id = parseInt(geo_id);
  try {
    const response = await fetch(
      `https://stats-visualiser.onrender.com/location/${loc_id}?topic=${topic_id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topic's details.");
  }
}

export async function GetGeolocToCountry(
  localization: geoTopicBranch
): Promise<geoTopicBranch[]> {
  let localTopic = {
    id: parseInt(localization.id),
    name: localization.name,
    source: localization.source,
    unit: localization.unit,
    children: localization.children,
    values: localization.values.sort((a, b) => b[0] - a[0]),
    hasChildren: localization.hasChildren,
    parentId: localization.parentId.toString(),
    externalId: localization.externalId,
    topicId: localization.topicId,
  };
  try {
    const resultingData: geoTopicBranch[] = [];
    while (localTopic.id !== 1) {
      const response = await fetch(
        `https://stats-visualiser.onrender.com/location/${localTopic.parentId}?topic=${localTopic.topicId}`
      );
      const data = await response.json();
      if (!data) {
        console.error("Database Error. Check your ids :", data);
        throw new Error(
          "Failed to fetch geo and loc's details. Check your ids"
        );
      }
      const localization: geoTopicBranch = {
        id: data.id.toString(),
        name: data.name,
        source: data.source,
        unit: data.unit,
        children: data.children,
        values: data.values.sort(
          (a: [number, number], b: [number, number]) => b[0] - a[0]
        ),
        hasChildren: data.hasChildren,
        parentId: data.parentId ? data.parentId.toString() : data.parentId,
        externalId: data.externalId,
        topicId: data.topicId,
      };
      resultingData.unshift(localization);
      localTopic = data;
    }

    if (resultingData && resultingData.length === 3) {
      return resultingData;
    } else {
      console.log("There seems to be a probleme in the datas");
      return [];
    }
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topic's details.");
  }
}
