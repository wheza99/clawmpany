/**
 * Standalone mode hook for web development.
 * Replaces VS Code extension messages with local data loading.
 */

import { useEffect, useRef, useState } from 'react';

import { setSoundEnabled } from '../notificationSound.js';
import type { OfficeState } from '../office/engine/officeState.js';
import { setFloorSprites } from '../office/floorTiles.js';
import { buildDynamicCatalog } from '../office/layout/furnitureCatalog.js';
import { migrateLayoutColors } from '../office/layout/layoutSerializer.js';
import { setCharacterTemplates } from '../office/sprites/spriteData.js';
import type { OfficeLayout, ToolActivity } from '../office/types.js';
import { setWallSprites } from '../office/wallTiles.js';
import { isStandalone } from '../vscodeApi.js';

import { loadAllAssets, type FurnitureAsset } from './assetLoader.js';

export interface SubagentCharacter {
  id: number;
  parentAgentId: number;
  parentToolId: string;
  label: string;
}

export interface WorkspaceFolder {
  name: string;
  path: string;
}

export interface StandaloneState {
  agents: number[];
  selectedAgent: number | null;
  agentTools: Record<number, ToolActivity[]>;
  agentStatuses: Record<number, string>;
  subagentTools: Record<number, Record<string, ToolActivity[]>>;
  subagentCharacters: SubagentCharacter[];
  layoutReady: boolean;
  layoutWasReset: boolean;
  loadedAssets?: { catalog: FurnitureAsset[]; sprites: Record<string, string[][]> };
  workspaceFolders: WorkspaceFolder[];
}

/**
 * Hook that provides standalone mode functionality.
 * Returns null if running in VS Code (use extension messages instead).
 */
export function useStandaloneMode(
  getOfficeState: () => OfficeState,
  onLayoutLoaded?: (layout: OfficeLayout) => void,
  _isEditDirty?: () => boolean,
): StandaloneState | null {
  const [state, setState] = useState<StandaloneState>({
    agents: [],
    selectedAgent: null,
    agentTools: {},
    agentStatuses: {},
    subagentTools: {},
    subagentCharacters: [],
    layoutReady: false,
    layoutWasReset: false,
    loadedAssets: undefined,
    workspaceFolders: [{ name: 'Demo Project', path: '/demo' }],
  });

  const layoutReadyRef = useRef(false);

  useEffect(() => {
    // Only run in standalone mode
    if (!isStandalone) return;

    const loadAssets = async () => {
      try {
        const assets = await loadAllAssets();

        // Set character sprites
        setCharacterTemplates(assets.characters);

        // Set floor tiles
        setFloorSprites(assets.floors);

        // Set wall tiles
        setWallSprites(assets.walls);

        // Build furniture catalog
        const spriteData: Record<string, string[][]> = {};
        for (const [id, sprite] of Object.entries(assets.furniture.sprites)) {
          spriteData[id] = sprite;
        }
        buildDynamicCatalog({
          catalog: assets.furniture.catalog,
          sprites: spriteData,
        });

        // Load layout
        const os = getOfficeState();
        if (assets.layout) {
          const layout = migrateLayoutColors(assets.layout as OfficeLayout);
          os.rebuildFromLayout(layout);
          onLayoutLoaded?.(layout);
        }

        // Add a demo agent for testing
        os.addAgent(1, 0, 0, undefined, true, 'Demo Agent');
        os.addAgent(2, 1, 0, undefined, true, 'Test Agent');
        os.addAgent(3, 2, 0, undefined, true, 'AI Assistant');

        layoutReadyRef.current = true;

        setState((prev) => ({
          ...prev,
          agents: [1, 2, 3],
          selectedAgent: 1,
          layoutReady: true,
          loadedAssets: {
            catalog: assets.furniture.catalog,
            sprites: spriteData,
          },
        }));

        // Enable sound by default in standalone
        setSoundEnabled(true);

        console.log('[Standalone] Mode initialized with demo agents');
      } catch (error) {
        console.error('[Standalone] Failed to load assets:', error);
      }
    };

    loadAssets();
  }, [getOfficeState, onLayoutLoaded]);

  // Return null in VS Code mode - use useExtensionMessages instead
  if (!isStandalone) {
    return null;
  }

  return state;
}
