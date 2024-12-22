<script module lang="ts">
  import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-svelte";
  import type { TreeItem } from "./tabTree";

  export const icons = {
    chevronRight: ChevronRight,
    chevronDown: ChevronDown,
    highlight: ArrowLeft,
  };
</script>

<script lang="ts">
  import Tree from "./Tree.svelte";
  import TreeItemIcon from "./TreeItemIcon.svelte";
  import { melt, type TreeView } from "@melt-ui/svelte";
  import { getContext } from "svelte";
  import { tabTreeManager } from "./tabTree";

  interface Props {
    treeItems: TreeItem[];
    level?: number;
  }

  let { treeItems, level = 1 }: Props = $props();

  const {
    elements: { item, group },
    helpers: { isExpanded, isSelected },
  } = getContext<TreeView>("tree");

  function handleItemClick(event: MouseEvent, tabId: number) {
    event.stopPropagation();
    tabTreeManager.activateTab(tabId);
  }

  function getChildCount(children: TreeItem[] | undefined): number {
    if (!children) return 0;
    return children.reduce((count, item) => {
      return count + 1 + getChildCount(item.children);
    }, 0);
  }
</script>

{#each treeItems as { title, favIconUrl, children, tabId }, i}
  {@const itemId = `${title}-${i}`}
  {@const hasChildren = !!children?.length}
  {@const childCount = getChildCount(children)}

  <li data-level={level} class={level !== 1 ? "pl-4" : ""}>
    <button
      class="flex items-center gap-1 rounded-md p-1 focus:bg-magnum-200"
      use:melt={$item({
        id: itemId,
        hasChildren,
      })}
      on:click={(e) => handleItemClick(e, tabId)}
    >
      <TreeItemIcon
        {favIconUrl}
        isExpanded={$isExpanded(itemId)}
        {hasChildren}
        {childCount}
      />

      <span class="select-none truncate max-w-[200px]" {title}>{title}</span>

      <!-- Selected icon -->
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
