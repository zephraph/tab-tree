<script lang="ts">
  import { ChevronRight, ChevronDown } from "lucide-svelte";

  export let favIconUrl: string | undefined;
  export let isExpanded: boolean;
  export let childCount: number;
  export let hasChildren: boolean;
</script>

<div class="relative group/icon">
  <!-- Favicon or fallback -->
  <div
    class="h-4 w-4 transition-opacity duration-200 {hasChildren
      ? 'group-hover/icon:opacity-30'
      : ''} {hasChildren && !isExpanded ? 'opacity-30' : ''}"
  >
    {#if favIconUrl}
      <img src={favIconUrl} alt="" class="h-full w-full" />
    {:else}
      <div class="h-full w-full bg-gray-200 rounded-sm" />
    {/if}
  </div>

  <!-- Chevron overlay (visible on hover or when collapsed) -->
  {#if hasChildren}
    <div
      class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 {!isExpanded
        ? 'opacity-100'
        : ''}"
    >
      {#if isExpanded}
        <ChevronDown class="h-4 w-4" />
      {:else}
        <ChevronRight class="h-4 w-4" />
      {/if}
    </div>

    <!-- Child count indicator (only shown when collapsed) -->
    {#if !isExpanded && childCount > 0}
      <div class="absolute -bottom-1 -right-0.5 text-[8px] text-gray-300">
        {childCount}
      </div>
    {/if}
  {/if}
</div>
