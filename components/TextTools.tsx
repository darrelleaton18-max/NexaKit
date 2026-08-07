"use client";

import WordCounter from "./TextTools/WordCounter";
import CaseConverter from "./TextTools/CaseConverter";
import ListTools from "./TextTools/ListTools";
import FindReplace from "./TextTools/FindReplace";
import LoremGenerator from "./TextTools/LoremGenerator";
import LanguageConverter from "./TextTools/LanguageConverter";

export default function TextTools({ activeTool }: { activeTool: string }) {
  return (
    <>
      <WordCounter activeTool={activeTool} />
      <CaseConverter activeTool={activeTool} />
      <ListTools activeTool={activeTool} />
      <FindReplace activeTool={activeTool} />
      <LoremGenerator activeTool={activeTool} />
      <LanguageConverter activeTool={activeTool} />
    </>
  );
}