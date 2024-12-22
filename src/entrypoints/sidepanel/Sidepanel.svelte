<script lang="ts">
  import { createTreeView } from "@melt-ui/svelte";
  import { setContext } from "svelte";

  import type { TreeItem } from "$lib/Tree.svelte";
  import Tree from "$lib/Tree.svelte";

  const ctx = createTreeView({
    defaultExpanded: ["lib-0", "tree-0"],
  });
  setContext("tree", ctx);

  const {
    elements: { tree },
  } = ctx;

  const treeItems: TreeItem[] = [
    { title: "index.svelte", icon: "svelte" },
    {
      title: "lib",
      icon: "folder",
      children: [
        {
          title: "tree",
          icon: "folder",
          children: [
            {
              title: "Tree.svelte",
              icon: "svelte",
            },
            {
              title: "TreeView.svelte",
              icon: "svelte",
            },
          ],
        },
        {
          title: "icons",
          icon: "folder",
          children: [
            { title: "JS.svelte", icon: "svelte" },
            { title: "Svelte.svelte", icon: "svelte" },
          ],
        },
        {
          title: "index.js",
          icon: "js",
        },
      ],
    },
    {
      title: "routes",
      icon: "folder",
      children: [
        {
          title: "contents",
          icon: "folder",
          children: [
            {
              title: "+layout.svelte",
              icon: "svelte",
            },
            {
              title: "+page.svelte",
              icon: "svelte",
            },
          ],
        },
      ],
    },
  ];
</script>

<div class="flex flex-col h-full rounded-xl bg-white text-neutral-900">
  <div class="flex flex-col gap-1 px-4 pt-4">
    <h3 class="text-lg font-bold">Project Structure</h3>
    <hr />
  </div>

  <ul class="overflow-auto px-4 pb-4 pt-2" {...$tree}>
    <Tree {treeItems} />
  </ul>
</div>
