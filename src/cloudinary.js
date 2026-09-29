export const CLOUD_NAME = "kprgilvn";
export const UPLOAD_PRESET = "nysl_photos";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ? data.error.message : 'Upload failed');
  }

  return data.secure_url;
};