import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import type { SchemaTypeDefinition } from 'sanity';

export default defineConfig({
  name: 'default',
  title: 'Cellule Infrastructures RDC',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '5sq6qhs4',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes as SchemaTypeDefinition[],
  },
});
