"use client";

import { Check, AlertCircle } from "lucide-react";
import { CPFUtils } from "../totem/utils/cpf";

interface CPFDisplayProps {
  cpf: string;
  showValidation?: boolean;
}

export function CPFDisplay({ cpf, showValidation = false }: CPFDisplayProps) {
  const isValid = CPFUtils.validate(cpf);
  const isComplete = CPFUtils.isComplete(cpf);

  return (
    <div className="text-center">
      <div
        className={`text-2xl font-mono p-4 rounded-lg border-2 transition-colors ${
          showValidation && cpf
            ? isValid
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
            : "bg-gray-100 border-gray-200"
        }`}
      >
        {CPFUtils.getMask(cpf)}
      </div>
      {showValidation && cpf && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {isComplete ? (
            isValid ? (
              <div className="flex items-center text-green-600">
                <Check className="h-4 w-4 mr-1" />
                <span className="text-sm">CPF válido</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">CPF inválido</span>
              </div>
            )
          ) : (
            <div className="text-gray-500 text-sm">
              Digite os {11 - CPFUtils.clean(cpf).length} dígitos restantes
            </div>
          )}
        </div>
      )}
    </div>
  );
}
