const utils = {
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
};

export default utils;
