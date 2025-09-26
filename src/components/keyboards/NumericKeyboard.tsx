"use client";

import { Button } from "@/components/ui/button";

interface NumericKeyboardProps {
  onKeyPress: (digit: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onConfirm: () => void;
  disabled?: boolean;
  confirmDisabled?: boolean;
}

export function NumericKeyboard({
  onKeyPress,
  onBackspace,
  onClear,
  onConfirm,
  disabled = false,
  confirmDisabled = false,
}: NumericKeyboardProps) {
  const numbers = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", ""],
  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-4 flex flex-col items-center">
      <div className="grid grid-cols-3 gap-2 max-w-xs">
        {" "}
        {/* 'mx-auto' removido */}
        {numbers.flat().map((num, index) =>
          num ? (
            <Button
              key={`num-${index}`}
              variant="outline"
              className="h-16 text-xl font-mono"
              onClick={() => onKeyPress(num)}
              disabled={disabled}
            >
              {num}
            </Button>
          ) : (
            <div key={`empty-${index}`} className="h-16" />
          )
        )}
      </div>

      <div className="flex gap-2 max-w-xs mt-4">
        {" "}
        {/* 'mx-auto' removido */}
        <Button
          variant="outline"
          className="flex-1 h-16 text-lg"
          onClick={onBackspace}
          disabled={disabled}
        >
          ⌫ Apagar
        </Button>
        <Button
          variant="outline"
          className="flex-1 h-16 text-lg"
          onClick={onClear}
          disabled={disabled}
        >
          Limpar
        </Button>
      </div>

      <Button
        className="w-full h-16 bg-green-600 text-xl mt-2 max-w-xs"
        onClick={onConfirm}
        disabled={disabled || confirmDisabled}
      >
        Confirmar
      </Button>
    </div>
  );
}
