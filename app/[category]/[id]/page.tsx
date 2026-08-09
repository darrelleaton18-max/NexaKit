import FinancialTools from "../../../components/FinancialTools";
import MathTools from "../../../components/MathTools";
import TimeDateTools from "../../../components/TimeDateTools";
import TextTools from "../../../components/TextTools";
import DevTools from "../../../components/DevTools";
import RandomTools from "../../../components/RandomTools";
import MediaTools from "../../../components/MediaTools";
import { navGroups } from "../../../components/navData";

// ==========================================
// STATIC GENERATION FOR GITHUB PAGES
// ==========================================
export function generateStaticParams() {
  const paths: { category: string; id: string }[] = [];
  
  navGroups.forEach((group) => {
    // Strips emojis/spaces to create clean URLs (e.g., "Finance Calculators" -> "financecalculators")
    const categorySlug = group.group.replace(/[^a-zA-Z]/g, "").toLowerCase();
    
    group.tools.forEach((tool) => {
      paths.push({ category: categorySlug, id: tool.id });
    });
  });

  return paths;
}

// ==========================================
// NEXT.JS 15 ASYNC PARAMS FIX
// ==========================================
export default async function ToolPage({ params }: { params: Promise<{ category: string; id: string }> }) {
  // We must explicitly await the params object before using the ID
  const resolvedParams = await params;
  const activeTool = resolvedParams.id;

  return (
    <div className="animate-in fade-in duration-300">
      <FinancialTools activeTool={activeTool} />
      <MathTools activeTool={activeTool} />
      <TimeDateTools activeTool={activeTool} />
      <TextTools activeTool={activeTool} />
      <DevTools activeTool={activeTool} />
      <RandomTools activeTool={activeTool} />
      
      {/* 
        Note: The MediaTools component currently requires isDark as a prop. 
        If you want to keep the dark mode checkerboards, you may need to fetch isDark 
        via context or a client wrapper here. For now, we pass false.
      */}
      <MediaTools activeTool={activeTool} isDark={false} />
    </div>
  );
}