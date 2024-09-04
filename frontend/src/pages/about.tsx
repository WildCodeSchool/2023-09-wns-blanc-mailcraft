import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"

export default function AboutPage() {
  return (
    <div className="App">
      <h1>Test du composant redimensionnable</h1>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={30} minSize={20}>
          left
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={30}>
          middle
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={30} minSize={20}>
          right
        </Panel>
      </PanelGroup>
    </div>
  );
}
