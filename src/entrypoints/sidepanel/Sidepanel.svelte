<script lang="ts">
  import { run } from 'svelte/legacy';

  import { createTreeView } from "@melt-ui/svelte";
  import { setContext } from "svelte";
  import { onMount } from "svelte";

  import type { TreeItem } from "$lib/Tree.svelte";
  import Tree from "$lib/Tree.svelte";
  import { tabTreeManager, treeItemsStore } from "$lib/tabTree";

  const ctx = createTreeView({
    defaultExpanded: [],
  });
  setContext("tree", ctx);

  const {
    elements: { tree },
  } = ctx;

  let treeItems: TreeItem[] = $state([]);

  onMount(() => {
    // Initial tree items
    treeItems = tabTreeManager.getTreeItems();
  });

  // Subscribe to tree items store
  run(() => {
    treeItems = $treeItemsStore;
  });
</script>

<div class="flex flex-col h-full rounded-xl bg-zinc-800 text-neutral-100">
  <div class="flex flex-col gap-1 px-4 pt-4">
    <h3 class="text-lg font-bold">Open Tabs</h3>
    <hr />
  </div>

  <ul class="overflow-auto px-4 pb-4 pt-2" {...$tree}>
    <Tree {treeItems} />
  </ul>
</div>
