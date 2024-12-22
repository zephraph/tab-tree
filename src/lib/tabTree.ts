import type { TreeItem } from "./Tree.svelte";
import { writable } from "svelte/store";

type TabInfo = {
  id: number;
  parentId?: number;
  title: string;
  url: string;
  favIconUrl?: string;
};

export const treeItemsStore = writable<TreeItem[]>([]);

class TabTreeManager {
  private tabsMap = new Map<number, TabInfo>();
  private rootTabs = new Set<number>();

  constructor() {
    this.initializeTabs();
    this.setupListeners();
  }

  private async initializeTabs() {
    const tabs = await browser.tabs.query({});
    tabs.forEach((tab) => {
      this.tabsMap.set(tab.id!, {
        id: tab.id!,
        parentId: tab.openerTabId,
        title: tab.title || "New Tab",
        url: tab.url || "",
        favIconUrl: tab.favIconUrl,
      });

      if (!tab.openerTabId) {
        this.rootTabs.add(tab.id!);
      }
    });
    this.updateTreeItems();
  }

  private setupListeners() {
    // Listen for new tabs
    browser.tabs.onCreated.addListener((tab) => {
      this.tabsMap.set(tab.id!, {
        id: tab.id!,
        parentId: tab.openerTabId,
        title: tab.title || "New Tab",
        url: tab.url || "",
        favIconUrl: tab.favIconUrl,
      });

      if (!tab.openerTabId) {
        this.rootTabs.add(tab.id!);
      }
      this.updateTreeItems();
    });

    // Listen for tab updates
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      const currentTab = this.tabsMap.get(tabId);
      if (currentTab) {
        this.tabsMap.set(tabId, {
          ...currentTab,
          title: tab.title || currentTab.title,
          url: tab.url || currentTab.url,
          favIconUrl: tab.favIconUrl || currentTab.favIconUrl,
        });
        this.updateTreeItems();
      }
    });

    // Listen for tab removals
    browser.tabs.onRemoved.addListener((tabId) => {
      this.tabsMap.delete(tabId);
      this.rootTabs.delete(tabId);
      this.updateTreeItems();
    });
  }

  private buildTreeItem(tabId: number): TreeItem {
    const tab = this.tabsMap.get(tabId)!;
    const children: TreeItem[] = [];

    // Find all child tabs
    for (const [id, childTab] of this.tabsMap.entries()) {
      if (childTab.parentId === tabId) {
        children.push(this.buildTreeItem(id));
      }
    }

    return {
      title: tab.title,
      favIconUrl: tab.favIconUrl,
      ...(children.length > 0 && { children }),
    };
  }

  private updateTreeItems() {
    const items: TreeItem[] = [];
    for (const rootTabId of this.rootTabs) {
      items.push(this.buildTreeItem(rootTabId));
    }
    treeItemsStore.set(items);
  }

  public getTreeItems(): TreeItem[] {
    const items: TreeItem[] = [];
    for (const rootTabId of this.rootTabs) {
      items.push(this.buildTreeItem(rootTabId));
    }
    return items;
  }
}

// Create and export a singleton instance
export const tabTreeManager = new TabTreeManager();
