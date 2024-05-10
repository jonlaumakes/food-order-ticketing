const formatLeftSide = (input: string): string => {
  return input.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const removeSpecialCharacters = (input: string): string => {
  return input.replace(/\D/g, "");
};

export const formatCurrency = (input: string): string => {
  // decimal present
  if (input.indexOf(".") >= 0) {
    const decimalPos = input.indexOf(".");
    const leftInputSide = input.substring(0, decimalPos);
    const rightInputSide = input.substring(decimalPos);

    const leftSideFormatted = formatLeftSide(leftInputSide);
    const rightSideCents = removeSpecialCharacters(rightInputSide).substring(
      0,
      2
    );

    return `$${leftSideFormatted}.${rightSideCents}`;
  } else {
    // no decimal
    return `$${formatLeftSide(input)}`;
  }
};

export const getCents = (input: string): number => {
  // decimal
  if (input.indexOf(".") >= 0) {
    const decimalPos = input.indexOf(".");
    const leftInputSide = input.substring(0, decimalPos);
    const rightInputSide = input.substring(decimalPos);

    const leftSideDollars = removeSpecialCharacters(leftInputSide);
    const rightSideCents = removeSpecialCharacters(rightInputSide).substring(
      0,
      2
    );

    return Number(leftSideDollars) * 100 + Number(rightSideCents);
  } else {
    return Number(removeSpecialCharacters(input)) * 100;
  }
};

export const convertCentsToDollars = (cents: number): string => {
  const dollars = Math.floor(cents / 100);
  const centsMod = cents % 100;

  return `$${dollars}.${centsMod}`;
};
