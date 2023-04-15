import { Storage } from "aws-amplify";
import { generateUUID } from "../util/generateId";

export const uploadImageToS3 = async (imageFile, eventId, folder) => {
  const imageId = generateUUID();
  const folderName = eventId;
  const key = `${folder}/${folderName}/${imageId}`;

  try {
    await Storage.put(key, imageFile, {
      contentType: imageFile.type,
    });
    console.log("Successfully uploaded image to S3");
    console.log("key:", key);
    return key;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    return null;
  }
};

export const getImageURL = async (key) => {
  try {
    const signedURL = await Storage.get(key);
    return signedURL;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
};
