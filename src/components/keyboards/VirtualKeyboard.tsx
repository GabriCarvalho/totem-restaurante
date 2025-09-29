"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  onClear: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

export function VirtualKeyboard({
  onKeyPress,
  onBackspace,
  onSpace,
  onClear,
  onConfirm,
  disabled = false,
}: VirtualKeyboardProps) {
  const [isUpperCase, setIsUpperCase] = useState(true);

  const firstRow = isUpperCase
    ? ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
    : ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

  const secondRow = isUpperCase
    ? ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
    : ["a", "s", "d", "f", "g", "h", "j", "k", "l"];

  const thirdRow = isUpperCase
    ? ["Z", "X", "C", "V", "B", "N", "M"]
    : ["z", "x", "c", "v", "b", "n", "m"];

  return (
    <div className="w-full h-[50vh] min-h-[500px] p-6">
      <div className="bg-white border-2 rounded-xl p-8 h-full flex flex-col justify-center gap-6 shadow-lg">
        {/* Primeira linha - QWERTYUIOP */}
        <div className="flex gap-3 justify-center">
          {firstRow.map((char) => (
            <Button
              key={char}
              variant="outline"
              className="w-20 h-20 text-3xl font-bold border-2 hover:bg-gray-100"
              onClick={() => onKeyPress(char)}
              disabled={disabled}
            >
              {char}
            </Button>
          ))}
        </div>

        {/* Segunda linha - ASDFGHJKL */}
        <div className="flex gap-3 justify-center">
          <div className="w-10"></div> {/* Espaço para centralizar */}
          {secondRow.map((char) => (
            <Button
              key={char}
              variant="outline"
              className="w-20 h-20 text-3xl font-bold border-2 hover:bg-gray-100"
              onClick={() => onKeyPress(char)}
              disabled={disabled}
            >
              {char}
            </Button>
          ))}
          <div className="w-10"></div> {/* Espaço para centralizar */}
        </div>

        {/* Terceira linha - ZXCVBNM */}
        <div className="flex gap-3 justify-center">
          <div className="w-20"></div> {/* Espaço para centralizar */}
          {thirdRow.map((char) => (
            <Button
              key={char}
              variant="outline"
              className="w-20 h-20 text-3xl font-bold border-2 hover:bg-gray-100"
              onClick={() => onKeyPress(char)}
              disabled={disabled}
            >
              {char}
            </Button>
          ))}
          <div className="w-20"></div> {/* Espaço para centralizar */}
        </div>

        {/* Linha de botões especiais */}
        <div className="flex gap-4 justify-center mt-4">
          <Button
            variant="outline"
            className="w-24 h-20 text-xl font-bold border-2 bg-gray-50 hover:bg-gray-200"
            onClick={() => setIsUpperCase(!isUpperCase)}
            disabled={disabled}
          >
            {isUpperCase ? "abc" : "ABC"}
          </Button>

          <Button
            variant="outline"
            className="w-40 h-20 text-xl font-bold border-2 hover:bg-gray-100"
            onClick={onSpace}
            disabled={disabled}
          >
            ESPAÇO
          </Button>

          <Button
            variant="outline"
            className="w-24 h-20 text-2xl border-2 bg-orange-50 hover:bg-orange-100"
            onClick={onBackspace}
            disabled={disabled}
          >
            ⌫
          </Button>

          <Button
            variant="outline"
            className="w-24 h-20 text-lg font-bold border-2 bg-red-50 hover:bg-red-100"
            onClick={onClear}
            disabled={disabled}
          >
            LIMPAR
          </Button>

          <Button
            className="w-32 h-20 text-xl font-bold bg-green-600 hover:bg-green-700 text-white"
            onClick={onConfirm}
            disabled={disabled}
          >
            CONFIRMAR
          </Button>
        </div>
      </div>
    </div>
  );
}
