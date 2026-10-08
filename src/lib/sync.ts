import { db, SyncQueueItem } from './db';
import { SyncStatus } from '../types';

type SyncListener = (status: SyncStatus) => void;

class SyncEngine {
  private isOnlineInternal: boolean = navigator.onLine;
  private isSimulatedOffline: boolean = false;
  private isSyncing: boolean = false;
  private listeners: Set<SyncListener> = new Set();
  private lastSyncedAt: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  constructor() {
    window.addEventListener('online', () => this.handleNetworkChange());
    window.addEventListener('offline', () => this.handleNetworkChange());
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getStatus(): SyncStatus {
    const online = !this.isSimulatedOffline && this.isOnlineInternal;
    return {
      isOnline: online,
      isSyncing: this.isSyncing,
      pendingCount: 0, // calculated dynamically in getPendingCount
      lastSyncedAt: this.lastSyncedAt
    };
  }

  public async getPendingCount(): Promise<number> {
    const unsyncedActivities = await db.activities.filter(a => !a.synced).count();
    const unsyncedTx = await db.transactions.filter(t => !t.synced).count();
    const queueCount = await db.sync_queue.count();
    return unsyncedActivities + unsyncedTx + queueCount;
  }

  public async notify() {
    const status = this.getStatus();
    status.pendingCount = await this.getPendingCount();
    this.listeners.forEach(fn => fn(status));
  }

  private handleNetworkChange() {
    this.isOnlineInternal = navigator.onLine;
    this.notify();
    if (this.isOnlineInternal && !this.isSimulatedOffline) {
      this.triggerSync();
    }
  }

  public toggleSimulatedOffline() {
    this.isSimulatedOffline = !this.isSimulatedOffline;
    this.notify();
    if (!this.isSimulatedOffline) {
      this.triggerSync();
    }
    return !this.isSimulatedOffline;
  }

  public isEffectivelyOnline(): boolean {
    return !this.isSimulatedOffline && this.isOnlineInternal;
  }

  public async enqueueChange(item: Omit<SyncQueueItem, 'id' | 'created_at'>) {
    const id = 'queue-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    await db.sync_queue.add({
      ...item,
      id,
      created_at: new Date().toISOString()
    });
    this.notify();

    if (this.isEffectivelyOnline()) {
      this.triggerSync();
    }
  }

  public async triggerSync(): Promise<{ success: boolean; syncedItems: number }> {
    if (!this.isEffectivelyOnline()) {
      return { success: false, syncedItems: 0 };
    }

    if (this.isSyncing) {
      return { success: true, syncedItems: 0 };
    }

    this.isSyncing = true;
    this.notify();

    let count = 0;

    try {
      // Simulate remote network roundtrip latency (e.g. 750ms)
      await new Promise(res => setTimeout(res, 800));

      // Mark all unsynced activities as synced
      const unsyncedActivities = await db.activities.filter(a => !a.synced).toArray();
      for (const act of unsyncedActivities) {
        await db.activities.update(act.id, { synced: true, updated_at: new Date().toISOString() });
        count++;
      }

      // Mark all unsynced transactions as synced
      const unsyncedTx = await db.transactions.filter(t => !t.synced).toArray();
      for (const tx of unsyncedTx) {
        await db.transactions.update(tx.id, { synced: true, updated_at: new Date().toISOString() });
        count++;
      }

      // Clear sync queue
      const queueItems = await db.sync_queue.toArray();
      count += queueItems.length;
      await db.sync_queue.clear();

      this.lastSyncedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      this.isSyncing = false;
      this.notify();
    }

    return { success: true, syncedItems: count };
  }
}

export const syncEngine = new SyncEngine();
