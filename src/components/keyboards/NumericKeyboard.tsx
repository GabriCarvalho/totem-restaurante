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
    <div className="w-full h-[80vh] min-h-[800px] max-h-[1200px] p-8 sm:p-12 lg:p-16">
      <div className="bg-white border-4 rounded-3xl p-8 sm:p-12 lg:p-16 h-full flex flex-col justify-center gap-8 sm:gap-12 lg:gap-16 shadow-2xl max-w-7xl mx-auto">
        {/* Grid de números */}
        <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16 items-center">
          {numbers.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex gap-8 sm:gap-12 lg:gap-16 justify-center"
            >
              {row.map((num, colIndex) =>
                num ? (
                  <Button
                    key={`num-${rowIndex}-${colIndex}`}
                    variant="outline"
                    className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold border-4 hover:bg-gray-100 flex-shrink-0 rounded-2xl"
                    onClick={() => onKeyPress(num)}
                    disabled={disabled}
                  >
                    {num}
                  </Button>
                ) : (
                  <div
                    key={`empty-${rowIndex}-${colIndex}`}
                    className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56"
                  />
                )
              )}
            </div>
          ))}
        </div>

        {/* Botões de ação */}
        <div className="flex gap-8 sm:gap-12 lg:gap-16 justify-center mt-8 sm:mt-12 lg:mt-16 flex-wrap">
          <Button
            variant="outline"
            className="w-40 h-24 sm:w-48 sm:h-32 lg:w-56 lg:h-40 xl:w-64 xl:h-48 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold border-4 bg-orange-50 hover:bg-orange-100 flex-shrink-0 rounded-2xl"
            onClick={onBackspace}
            disabled={disabled}
          >
            ⌫
          </Button>

          <Button
            variant="outline"
            className="w-40 h-24 sm:w-48 sm:h-32 lg:w-56 lg:h-40 xl:w-64 xl:h-48 text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold border-4 bg-red-50 hover:bg-red-100 flex-shrink-0 rounded-2xl"
            onClick={onClear}
            disabled={disabled}
          >
            LIMPAR
          </Button>

          <Button
            className="w-48 h-24 sm:w-56 sm:h-32 lg:w-64 lg:h-40 xl:w-72 xl:h-48 text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-green-600 hover:bg-green-700 text-white flex-shrink-0 rounded-2xl"
            onClick={onConfirm}
            disabled={disabled || confirmDisabled}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
