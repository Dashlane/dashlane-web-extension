export interface Sync {
  clear: () => Promise<void>;
  stop: () => void;
}
