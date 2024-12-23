<script module lang="ts">
  import { X } from "lucide-svelte";
  import type { TreeItem } from "./tabTree";
</script>

<script lang="ts">
  import Tree from "./Tree.svelte";
  import TreeItemIcon from "./TreeItemIcon.svelte";
  import { melt, type TreeView } from "@melt-ui/svelte";
  import type { MeltEventHandler } from "@melt-ui/svelte/internal/types";
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
    states: { selectedItem },
  } = getContext<TreeView>("tree");

  $effect(() => {
    tabTreeManager.activateTab(
      parseInt($selectedItem?.getAttribute("data-tab-id")!),
    );
  });

  function handleClose(event: Event, tabId: number) {
    event.stopPropagation();
    event.preventDefault();
    tabTreeManager.closeTab(tabId);
  }

  const handleKeydown: MeltEventHandler<KeyboardEvent> = (event) => {
    const key = event.detail.originalEvent.key;
    if (key === "n") {
      event.preventDefault();
      tabTreeManager.createTab();
    } else if (key === "q" && $selectedItem) {
      event.preventDefault();
      const tabId = parseInt($selectedItem.getAttribute("data-tab-id")!);
      tabTreeManager.closeTab(tabId);
    }
  };

  const handleClick: MeltEventHandler<MouseEvent> = (event) => {
    const icon = (event.target as HTMLElement).querySelector(
      "[data-item-icon]",
    );
    if (!icon || !icon.contains(event.detail.originalEvent.target as Node)) {
      event.preventDefault();
      $selectedItem = event.target as HTMLElement;
    }
  };

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
      class="flex items-center gap-1 rounded-md p-1 mb-1 hover:bg-zinc-700 focus:bg-zinc-700 cursor-pointer group relative w-full pr-8 {$isSelected(
        itemId,
      )
        ? 'ring-2 ring-orange-400 bg-orange-400/10'
        : ''}"
      data-tab-id={tabId}
      use:melt={$item({
        id: itemId,
        hasChildren,
      })}
      onm-click={handleClick}
      onm-keydown={handleKeydown}
    >
      <TreeItemIcon
        {favIconUrl}
        isExpanded={$isExpanded(itemId)}
        {hasChildren}
        {childCount}
      />

      <span class="select-none truncate flex-1 text-left ml-2" {title}
        >{title}</span
      >

      <!-- Close button -->
      <a
        type="button"
        href="/"
        class="opacity-0 group-focus:opacity-100 group-hover:opacity-100 focus:opacity-100 hover:bg-zinc-600 p-1 rounded absolute right-1 cursor-pointer flex-shrink-0"
        onmousedown={(e) => handleClose(e, tabId)}
        onkeydown={(e) => e.key === "Enter" && handleClose(e, tabId)}
      >
        <X class="h-3 w-3" />
      </a>
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
