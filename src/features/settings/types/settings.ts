export interface StoreSettings {
  _id: string;
  storeName: string;
  storePhone: string;
  workingHours: string;
  /** The unit list offered when adding a product — editable from the dashboard. */
  units: string[];
}
