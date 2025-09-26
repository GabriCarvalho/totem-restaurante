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
  const [isUpperCase, setIsUpperCase] = useState(false);

  const firstRow = isUpperCase
    ? ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
    : ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

  const secondRow = isUpperCase
    ? ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
    : ["a", "s", "d", "f", "g", "h", "j", "k", "l"];

  const thirdRow = isUpperCase
    ? ["Z", "X", "C", "V", "B", "N", "M"]
    : ["z", "x", "c", "v", "b", "n", "m"];

  const numbersRow = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      {/* Linha de números */}
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {numbersRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>

      {/* Primeira linha */}
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {firstRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>

      {/* Segunda linha */}
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {secondRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>

      {/* Terceira linha */}
      <div className="flex justify-center gap-1 mb-2 flex-wrap">
        {thirdRow.map((char) => (
          <Button
            key={char}
            variant="outline"
            className="w-12 h-12 text-lg font-mono"
            onClick={() => onKeyPress(char)}
            disabled={disabled}
          >
            {char}
          </Button>
        ))}
      </div>

      {/* Botões especiais */}
      <div className="flex justify-center gap-2 flex-wrap">
        <Button
          variant="outline"
          className="h-12"
          onClick={() => setIsUpperCase(!isUpperCase)}
          disabled={disabled}
        >
          {isUpperCase ? "ABC" : "abc"}
        </Button>
        <Button
          variant="outline"
          className="h-12"
          onClick={onSpace}
          disabled={disabled}
        >
          Espaço
        </Button>
        <Button
          variant="outline"
          className="h-12"
          onClick={onBackspace}
          disabled={disabled}
        >
          ⌫
        </Button>
        <Button
          variant="outline"
          className="h-12"
          onClick={onClear}
          disabled={disabled}
        >
          Limpar
        </Button>
        <Button
          className="h-12 bg-green-600"
          onClick={onConfirm}
          disabled={disabled}
        >
          OK
        </Button>
      </div>
    </div>
  );
}
