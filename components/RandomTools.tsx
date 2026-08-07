"use client";

import PasswordGenerator from "./RandomTools/PasswordGenerator";
import NumberGenerator from "./RandomTools/NumberGenerator";
import UuidGenerator from "./RandomTools/UuidGenerator";
import DiceAndCoin from "./RandomTools/DiceAndCoin";

export default function RandomTools({ activeTool }: { activeTool: string }) {
  return (
    <>
      <PasswordGenerator activeTool={activeTool} />
      <NumberGenerator activeTool={activeTool} />
      <UuidGenerator activeTool={activeTool} />
      <DiceAndCoin activeTool={activeTool} />
    </>
  );
}