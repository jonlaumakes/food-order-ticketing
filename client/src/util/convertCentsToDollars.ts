const convertCentsToDollars = (cents: number): string => {
  const dollars = Math.floor(cents / 100);
  const centsMod = cents % 100;

  return `$${dollars}.${centsMod}`;
};

export default convertCentsToDollars;
