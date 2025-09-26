// src/components/totem/utils/currency.ts
export const formatCurrency = (value: number): string => {
  return `R\$ ${value.toFixed(2).replace(".", ",")}`;
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace("R$", "").replace(",", ".").trim());
};
