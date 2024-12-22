<script module lang="ts">
  import {
    ArrowLeft,
    Folder,
    FolderOpen,
    FileJson as JS,
    Badge as Svelte,
  } from "lucide-svelte";

  type Icon = "svelte" | "folder" | "js";

  export type TreeItem = {
    title: string;
    icon: Icon;

    children?: TreeItem[];
  };

  export const icons = {
    svelte: Svelte,
    folder: Folder,
    folderOpen: FolderOpen,
    js: JS,
    highlight: ArrowLeft,
  };
</script>

<script lang="ts">
  import Tree from "./Tree.svelte";
  import { melt, type TreeView } from "@melt-ui/svelte";
  import { getContext } from "svelte";

  interface Props {
    treeItems: TreeItem[];
    level?: number;
  }

  let { treeItems, level = 1 }: Props = $props();

  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected },
  } = getContext<TreeView>("tree");
</script>

{#each treeItems as { title, icon, children }, i}
  {@const itemId = `${title}-${i}`}
  {@const hasChildren = !!children?.length}

  <li data-level={level} class={level !== 1 ? "pl-4" : ""}>
    <button
      class="flex items-center gap-1 rounded-md p-1 focus:bg-magnum-200"
      use:melt={$item({
        id: itemId,
        hasChildren,
      })}
    >
      <!-- Add icon. -->
      {#if icon === "folder" && hasChildren && $isExpanded(itemId)}
        {@const SvelteComponent = icons["folderOpen"]}
        <SvelteComponent class="h-4 w-4" />
      {:else}
        {@const SvelteComponent_1 = icons[icon]}
        <SvelteComponent_1 class="h-4 w-4" />
      {/if}

      <span class="select-none">{title}</span>

      <!-- Selected icon. -->
      {#if $isSelected(itemId)}
        {@const SvelteComponent_2 = icons["highlight"]}
        <SvelteComponent_2 class="h-4 w-4" />
      {/if}
    </button>

    {#if children}
      <ul use:melt={$group({ id: itemId })}>
        <Tree treeItems={children} level={level + 1} />
      </ul>
    {/if}
  </li>
{/each}

<style>
  /* Remove docs' focus box-shadow styling. */
  li:focus {
    box-shadow: none !important;
  }
</style>
