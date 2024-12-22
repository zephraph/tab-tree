<script module lang="ts">
  import { ArrowLeft, ChevronRight, ChevronDown } from "lucide-svelte";

  export type TreeItem = {
    title: string;
    favIconUrl?: string;
    children?: TreeItem[];
  };

  export const icons = {
    chevronRight: ChevronRight,
    chevronDown: ChevronDown,
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

{#each treeItems as { title, favIconUrl, children }, i}
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
      <!-- Favicon or fallback -->
      {#if favIconUrl}
        <img src={favIconUrl} alt="" class="h-4 w-4" />
      {:else}
        <div class="h-4 w-4 bg-gray-200 rounded-sm" />
        <!-- Fallback for no favicon -->
      {/if}

      <!-- Expansion indicator for items with children -->
      {#if hasChildren}
        {#if $isExpanded(itemId)}
          {@const SvelteComponent = icons["chevronDown"]}
          <SvelteComponent class="h-4 w-4" />
        {:else}
          {@const SvelteComponent = icons["chevronRight"]}
          <SvelteComponent class="h-4 w-4" />
        {/if}
      {:else}
        <div class="w-4" />
        <!-- Spacer for items without children -->
      {/if}

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
