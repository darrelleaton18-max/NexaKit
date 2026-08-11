"use client";

import JsonFormatter from "./DevTools/JsonFormatter";
import Base64Tools from "./DevTools/Base64Tools";
import UrlEncoder from "./DevTools/UrlEncoder";
import UrlInspector from "./DevTools/UrlInspector";
import MultiUrlViewer from "./DevTools/MultiUrlViewer"; // <--- 1. Import
import HashGenerator from "./DevTools/HashGenerator";
import ColorConverter from "./DevTools/ColorConverter";
import QrGenerator from "./DevTools/QrGenerator";

export default function DevTools({ activeTool }: { activeTool: string }) {
  return (
    <>
      <JsonFormatter activeTool={activeTool} />
      <Base64Tools activeTool={activeTool} />
      <UrlEncoder activeTool={activeTool} />
      <UrlInspector activeTool={activeTool} />
      <MultiUrlViewer activeTool={activeTool} /> {/* <--- 2. Add here */}
      <HashGenerator activeTool={activeTool} />
      <ColorConverter activeTool={activeTool} />
      <QrGenerator activeTool={activeTool} />
    </>
  );
}