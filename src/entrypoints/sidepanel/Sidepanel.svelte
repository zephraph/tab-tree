<script lang="ts">
  import { createTreeView } from "@melt-ui/svelte";
  import { setContext } from "svelte";

  import Tree from "$lib/Tree.svelte";
  import { treeItemsStore } from "$lib/tabTree";

  const ctx = createTreeView({
    defaultExpanded: [],
  });
  setContext("tree", ctx);

  const {
    elements: { tree },
  } = ctx;
</script>

<div class="flex flex-col h-full rounded-xl bg-zinc-800 text-neutral-100">
  <div class="flex flex-col gap-1 px-4 pt-4">
    <h3 class="text-lg font-bold">Open Tabs</h3>
    <hr />
  </div>

  <ul class="overflow-auto px-4 pb-4 pt-2" {...$tree}>
    <Tree treeItems={$treeItemsStore} />
  </ul>
</div>
