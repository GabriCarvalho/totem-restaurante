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
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="bg-white border-4 border-gray-200 rounded-3xl p-12 shadow-2xl w-full max-w-none">
        <div className="flex flex-col gap-6">
          {/* ✅ PRIMEIRA LINHA - QWERTYUIOP */}
          <div className="flex gap-5 justify-center">
            {firstRow.map((char) => (
              <Button
                key={char}
                variant="outline"
                className="w-32 h-32 text-5xl font-bold border-3 border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg"
                onClick={() => onKeyPress(char)}
                disabled={disabled}
              >
                {char}
              </Button>
            ))}
          </div>

          {/* ✅ SEGUNDA LINHA - ASDFGHJKL */}
          <div className="flex gap-5 justify-center">
            <div className="w-16"></div> {/* Espaço para centralizar */}
            {secondRow.map((char) => (
              <Button
                key={char}
                variant="outline"
                className="w-32 h-32 text-5xl font-bold border-3 border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg"
                onClick={() => onKeyPress(char)}
                disabled={disabled}
              >
                {char}
              </Button>
            ))}
            <div className="w-16"></div> {/* Espaço para centralizar */}
          </div>

          {/* ✅ TERCEIRA LINHA - ZXCVBNM */}
          <div className="flex gap-5 justify-center">
            <div className="w-32"></div> {/* Espaço para centralizar */}
            {thirdRow.map((char) => (
              <Button
                key={char}
                variant="outline"
                className="w-32 h-32 text-5xl font-bold border-3 border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg"
                onClick={() => onKeyPress(char)}
                disabled={disabled}
              >
                {char}
              </Button>
            ))}
            <div className="w-32"></div> {/* Espaço para centralizar */}
          </div>

          {/* ✅ LINHA DE BOTÕES ESPECIAIS - EXTRA AMPLIADA */}
          <div className="flex gap-6 justify-center mt-8">
            {/* Botão ABC/abc */}
            <Button
              variant="outline"
              className="w-40 h-32 text-3xl font-bold border-3 border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg"
              onClick={() => setIsUpperCase(!isUpperCase)}
              disabled={disabled}
            >
              {isUpperCase ? "abc" : "ABC"}
            </Button>

            {/* Botão ESPAÇO - Extra Extra Grande */}
            <Button
              variant="outline"
              className="w-96 h-32 text-3xl font-bold border-3 border-gray-300 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg"
              onClick={onSpace}
              disabled={disabled}
            >
              ESPAÇO
            </Button>

            {/* Botão BACKSPACE */}
            <Button
              variant="outline"
              className="w-40 h-32 text-4xl border-3 border-orange-300 bg-orange-50 hover:bg-orange-100 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg"
              onClick={onBackspace}
              disabled={disabled}
            >
              ⌫
            </Button>

            {/* Botão LIMPAR */}
            <Button
              variant="outline"
              className="w-40 h-32 text-2xl font-bold border-3 border-red-300 bg-red-50 hover:bg-red-100 transition-all duration-200 rounded-2xl shadow-md hover:shadow-lg"
              onClick={onClear}
              disabled={disabled}
            >
              LIMPAR
            </Button>

            {/* Botão CONFIRMAR */}
            <Button
              className="w-48 h-32 text-3xl font-bold bg-green-600 hover:bg-green-700 text-white transition-all duration-200 rounded-2xl shadow-lg hover:shadow-xl"
              onClick={onConfirm}
              disabled={disabled}
            >
              CONFIRMAR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
