import PocketBase from 'pocketbase';

const pocketbaseUrl = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

export const pb = new PocketBase(pocketbaseUrl);

// Optional: Auto-configure auth store for persistence
pb.authStore.onChange(() => {
  // You can add custom logic here when auth state changes
  console.log('PocketBase auth state changed');
});
