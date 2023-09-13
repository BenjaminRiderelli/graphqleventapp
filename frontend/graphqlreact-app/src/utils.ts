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
