import React from 'react';
import { renderToString } from 'react-dom/server';
import HolidayVoltageTool from './src/tools/compliance/HolidayVoltageTool';
import CorrosionRateTool from './src/tools/compliance/CorrosionRateTool';
import CoatingLifePredictionTool from './src/tools/compliance/CoatingLifePredictionTool';
import TSASuite from './src/tools/specialized/TSASuite';
import PFPSuite from './src/tools/specialized/PFPSuite';
import ProcurementSuite from './src/tools/specialized/ProcurementSuite';
import { ToastProvider } from './src/context/ToastContext';
import { GuidelineProvider } from './src/context/GuidelineContext';

function wrap(comp) {
  return renderToString(
    <ToastProvider>
      <GuidelineProvider>
        {comp}
      </GuidelineProvider>
    </ToastProvider>
  );
}

try {
  console.log("Testing HolidayVoltageTool...");
  wrap(<HolidayVoltageTool />);
  console.log("HolidayVoltageTool: OK");

  console.log("Testing CorrosionRateTool...");
  wrap(<CorrosionRateTool />);
  console.log("CorrosionRateTool: OK");

  console.log("Testing CoatingLifePredictionTool...");
  wrap(<CoatingLifePredictionTool />);
  console.log("CoatingLifePredictionTool: OK");

  console.log("Testing TSASuite...");
  wrap(<TSASuite activeSubTool="tsa-wire" />);
  console.log("TSASuite: OK");

  console.log("Testing PFPSuite...");
  wrap(<PFPSuite activeSubTool="pfp-mat" />);
  console.log("PFPSuite: OK");

  console.log("Testing ProcurementSuite...");
  wrap(<ProcurementSuite activeSubTool="bid-proc" />);
  console.log("ProcurementSuite: OK");

  console.log("ALL COMPONENTS RENDERED SUCCESSFULLY!");
} catch (e) {
  console.error("ERROR RENDERING:", e);
}
