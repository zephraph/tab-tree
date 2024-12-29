<script lang="ts">
  import { createTreeView, melt } from "@melt-ui/svelte";
  import { setContext } from "svelte";

  import Tree from "$lib/Tree.svelte";
  import { treeItemsStore, tabTreeManager } from "$lib/tabTree";
  import type { MeltEventHandler } from "@melt-ui/svelte/internal/types";

  const ctx = createTreeView({
    defaultExpanded: [],
  });
  setContext("tree", ctx);

  const {
    elements: { tree },
    states: { selectedItem },
  } = ctx;

  const handleKeydown = (event: KeyboardEvent) => {
    const key = event.key;
    if (key === "n") {
      event.preventDefault();
      tabTreeManager.createTab();
    } else if (key === "q" && $selectedItem) {
      event.preventDefault();
      const tabId = parseInt($selectedItem.getAttribute("data-tab-id")!);
      tabTreeManager.closeTab(tabId);
    }
  };
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="flex flex-col h-full rounded-xl bg-zinc-800 text-neutral-100">
  <div class="flex flex-col gap-1 px-4 pt-4">
    <h3 class="text-lg font-bold">Open Tabs</h3>
    <hr />
  </div>

  <ul class="overflow-auto px-4 pb-4 pt-2" {...$tree}>
    <Tree treeItems={$treeItemsStore} />
  </ul>
</div>
