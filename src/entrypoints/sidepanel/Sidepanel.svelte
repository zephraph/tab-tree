<script lang="ts">
  import { createTreeView } from "@melt-ui/svelte";
  import { setContext } from "svelte";

  import Tree from "$lib/Tree.svelte";
  import { treeItemsStore, tabTreeManager } from "$lib/tabTree";

  type KeyMap = Record<string, (() => void) | [() => boolean, () => void]>;
  const keyMap: KeyMap = {
    n: () => tabTreeManager.createTab(),
    q: [
      () => !!$selectedItem,
      () => {
        const tabId = parseInt($selectedItem!.getAttribute("data-tab-id")!);
        tabTreeManager.closeTab(tabId);
      },
    ],
  };

  const ctx = createTreeView({
    defaultExpanded: [],
  });
  setContext("tree", ctx);

  const {
    elements: { tree },
    states: { selectedItem },
  } = ctx;

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key in keyMap) {
      const keyAction = keyMap[event.key];
      if (Array.isArray(keyAction)) {
        if (keyAction[0]()) {
          event.preventDefault();
          keyAction[1]();
        }
      } else {
        event.preventDefault();
        keyAction();
      }
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
