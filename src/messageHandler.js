exports.matchMessage = (matchJson) => {
  const date = new Date(matchJson["kickOffTime"]);
  const dateString = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const timeWithoutSeconds = formattedTime.slice(0, -3).toLowerCase();

  return `
      *${matchJson["tournament"]["nameEn"]}*
  \\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-

  ${matchJson["teamName1"]} VS ${matchJson["teamName2"]}

  \\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-\\-
  🏟️ ${matchJson["stadiumName"]}
  ⏱️${dateString} \\- ${timeWithoutSeconds}pm
    `.replace(".","\\.");
};
