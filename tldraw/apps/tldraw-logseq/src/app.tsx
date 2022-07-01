/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TLDocumentModel } from '@tldraw/core'
import {
  AppCanvas,
  AppProvider,
  TLReactCallbacks,
  TLReactComponents,
  TLReactToolConstructor,
} from '@tldraw/react'
import * as React from 'react'
import { AppUI } from '~components/AppUI'
import { ContextBar } from '~components/ContextBar/ContextBar'
import { useFileDrop } from '~hooks/useFileDrop'
import { usePaste } from '~hooks/usePaste'
import { useQuickAdd } from '~hooks/useQuickAdd'
import { LogseqContext } from '~lib/logseq-context'
import { Shape, shapes } from '~lib/shapes'
import {
  BoxTool,
  DotTool,
  EllipseTool,
  HighlighterTool,
  LineTool,
  LogseqPortalTool,
  NuEraseTool,
  PencilTool,
  PolygonTool,
  TextTool,
  YouTubeTool,
} from '~lib/tools'

const components: TLReactComponents<Shape> = {
  ContextBar: ContextBar,
}

const tools: TLReactToolConstructor<Shape>[] = [
  // BoxTool,
  // DotTool,
  // EllipseTool,
  // PolygonTool,
  NuEraseTool,
  HighlighterTool,
  LineTool,
  PencilTool,
  TextTool,
  YouTubeTool,
  LogseqPortalTool,
]

interface LogseqTldrawProps {
  PageComponent: any
  searchHandler: (query: string) => string[]
  model?: TLDocumentModel<Shape>
  onMount?: TLReactCallbacks<Shape>['onMount']
  onPersist?: TLReactCallbacks<Shape>['onPersist']
}

export const App = function App({
  searchHandler,
  PageComponent,
  ...props
}: LogseqTldrawProps): JSX.Element {
  const onFileDrop = useFileDrop()
  const onPaste = usePaste()
  const onQuickAdd = useQuickAdd()

  const Page = React.useMemo(() => React.memo(PageComponent), [])
  return (
    <LogseqContext.Provider value={{ Page, search: searchHandler }}>
      <AppProvider
        Shapes={shapes}
        Tools={tools}
        onFileDrop={onFileDrop}
        onPaste={onPaste}
        onCanvasDBClick={onQuickAdd}
        {...props}
      >
        <div className="logseq-tldraw logseq-tldraw-wrapper">
          <AppCanvas components={components}>
            <AppUI />
          </AppCanvas>
        </div>
      </AppProvider>
    </LogseqContext.Provider>
  )
}