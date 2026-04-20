# Workflow Designer | Intelligent Automation Platform

A beautifully crafted, heavily-architected visual orchestrator for building complex logical pipelines. This application allows users to construct node-based execution maps, connect distinct procedural steps, and persist their work seamlessly directly in their browser.

## Architectural Overview

This platform uses a multi-tab workspace architecture allowing concurrent isolated systems to run within a single application instance (similar to how Chrome manages background tabs).

### Directory Structure

- `/src` - Core application root.
  - `/api` - Mock endpoints for simulating workflow paths.
  - `/components` - Specialized UI components broken down by functional region.
    - `/automations` - Renders the data-table list of all completed, saved workflows.
    - `/canvas` - Housing `ReactFlow` integrations: containing visual Nodes (`CustomNodes.tsx`), the `ActionsToolbar.tsx`, `Sidebar.tsx`, and the `WorkspaceTabsBar.tsx`.
    - `/dashboard` - Visual KPI metrics calculating total platform load natively from local storage memory.
    - `/forms` - The right hand `NodeFormPanel.tsx` governing dynamic state extraction when double-clicking any grid element.
    - `/sandbox` - A simulated shell terminal (`SandboxPanel.tsx`) that executes the workflow state when running.
    - `/settings` - UI scaling definitions and application interface bounds.
    - `/templates` - Interactive boilerplate configurations.
  - `/icons` - Reusable bespoke SVG vectors.
  - `/store` - Contains `workflowStore.ts`, the beating heart of the application using `zustand`. This powers persistent caching, undo/redo logic, active tab extraction, and node mutations.
  - `/types` - TypeScript interfaces ensuring total prop safety.

### Nodes & Types

The canvas supports dynamic node injection:
- **Start Node**: Defines structural entry points. Accepts custom JSON metadata config.
- **Task Node**: Assignable components requiring description mapping, assignees, due dates, and extended arbitrary custom field bindings.
- **Approval Node**: Routing stops mapping directly to systemic roles (Managers, HRBPs) and financial threshold limitations.
- **Automated Step Node**: Binds actions (e.g. Emailing, Generative Docs) passing variable JSON payloads instantly.
- **End Node**: Conclusive mapping endpoints capable of enforcing summary logging at pipeline termination.

## Getting Started

### Installation
Ensure you have `Node.js` installed on your localized system.
Run the root package mapping to download all architectural dependencies:

```bash
npm install
```

### Local Development Server
Boot up the `Vite` hot-reloading development pipeline by running:

```bash
npm run dev
```

The terminal will serve local hosting output (typically `http://localhost:5173/`).

### Building for Production
To bundle and optimize the raw React/TypeScript source into a minified, lightweight static deliverable:

```bash
npm run build
```

This will run rigorous `tsc` validations and generate a pure `/dist` folder. All elements utilize highly efficient Vite bundling architectures resulting in instant load speeds.
