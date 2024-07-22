"use client";

import { useRef, ChangeEvent, KeyboardEvent } from "react";

interface VerificationCodeInputProps {
  code: string[];
  onChange: (code: string[]) => void;
}

export function VerificationCodeInput({
  code,
  onChange,
}: VerificationCodeInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    onChange(newCode);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-6 mob-sm:grid mob-sm:grid-cols-6 mob-sm:gap-2">
      {code.map((num, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={num}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputs.current[index] = el)}
          className="w-10 h-10 mob-sm:w-8 mob-sm:h-8 text-2xl mob-sm:text-xl text-center border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-700"
        />
      ))}
    </div>
  );
}
export default VerificationCodeInput;
