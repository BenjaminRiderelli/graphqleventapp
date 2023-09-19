type userSession = {
  token: string;
  userId: string;
  tokenExpiration: number;
};

export const formatDate = (inputDate: string | undefined) => {
  if (!inputDate) {
    return;
  }
  const dateToConvert = new Date(inputDate).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const parts = dateToConvert.split("/");
  const formattedDate = `${parts[1]}/${parts[0]}/${parts[2]}`;
  return formattedDate;
};

export const extractTimeFromISOString = (dateTimeString: string) => {
  if (!dateTimeString) {
    return;
  }
  const dateTimeParts = dateTimeString?.split("T");
  if (dateTimeParts.length === 2) {
    const timeString = dateTimeParts[1].split(".")[0];
    const finalString = timeString.split(":").splice(0, 2).join(":");
    return finalString;
  } else {
    return;
  }
};

export const fullIsoStringToReadableFormat = (isoString: string) => {
  if (!isoString) {
    return;
  } else {
    const readableFormatDate = `${formatDate(
      isoString
    )} - ${extractTimeFromISOString(isoString)}`;
    return readableFormatDate;
  }
};


export const getStorageObject = (key:string) => {
  const item = localStorage.getItem(key);
  if (item !== null) {
    return JSON.parse(item);
  }
  return null;
};

export const setStorageObject = (key:string, object:object) => {
  localStorage.setItem(key, JSON.stringify(object));
};

export const deleteStorageObject = (key:string) => {
  localStorage.removeItem(key);
};

export const getUserToken = () => {
  const session = getStorageObject("user-session");
  if (session) {
    return session.token;
  }
  return null;
};
export const getUserSession = () => {
  const session = getStorageObject("user-session");
  if (session) {
    return session;
  }
  return null;
};

export const setStorageUserSession = (sessionData:userSession) => {
  setStorageObject("user-session", sessionData);
};

export const removeSession = () => {
  deleteStorageObject("user-session");
};
