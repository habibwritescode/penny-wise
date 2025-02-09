const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const dateTimeFormatter = {
  formatToLongDate: (dateString: string) => {
    if (!dateString) {
      return "";
    }
    const newDate = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };

    const formattedDate = newDate.toLocaleDateString("en-GB", options);
    const [day, month, year] = formattedDate.split(" ");
    // =>  19 Aug 2024
    return `${day} ${month} ${year}`;
  },

  getDayOfMonth: (dateString: string) => {
    const date = new Date(dateString);
    const dayOfMonth = date.getUTCDate();
    const ordinalSuffix = getOrdinalSuffix(dayOfMonth);

    return `${dayOfMonth}${ordinalSuffix}`;
  },
};

export default dateTimeFormatter;
