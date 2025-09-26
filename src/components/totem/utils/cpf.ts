export const CPFUtils = {
  clean: (cpf: string): string => cpf.replace(/\D/g, ""),

  format: (cpf: string): string => {
    const cleaned = CPFUtils.clean(cpf);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return cleaned.replace(/(\d{3})(\d+)/, "$1.$2");
    if (cleaned.length <= 9)
      return cleaned.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
  },

  validate: (cpf: string): boolean => {
    const cleaned = CPFUtils.clean(cpf);
    if (cleaned.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleaned)) return false;

    let sum = 0;
    let remainder;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

    return true;
  },

  isComplete: (cpf: string): boolean => CPFUtils.clean(cpf).length === 11,

  getMask: (cpf: string): string => {
    const cleaned = CPFUtils.clean(cpf);
    const mask = "___.___.___-__";
    let result = "";
    let maskIndex = 0;
    let cpfIndex = 0;

    while (maskIndex < mask.length && cpfIndex < cleaned.length) {
      if (mask[maskIndex] === "_") {
        result += cleaned[cpfIndex];
        cpfIndex++;
      } else {
        result += mask[maskIndex];
      }
      maskIndex++;
    }

    while (maskIndex < mask.length) {
      result += mask[maskIndex];
      maskIndex++;
    }

    return result;
  },
};
