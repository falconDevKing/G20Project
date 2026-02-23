export const camelCaseToNormal = (text: string) => {
  if (!text) {
    return "";
  }
  const replacedText = text?.replace(/([A-Z]+)/g, " $1") || "";
  const formmatedText = replacedText.charAt(0).toUpperCase() + replacedText.slice(1);

  return formmatedText;
};

export const CapitaliseText = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);
export const CapitaliseWords = (text: string): string =>
  text
    .split(" ")
    .map((word) => CapitaliseText(word))
    .join(" ");

export const formatCamelCaseToCapitalisedSentence = (input: string): string => input.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
