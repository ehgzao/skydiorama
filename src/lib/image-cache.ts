import { get, set, del, keys } from 'idb-keyval';

const PREFIX = 'diorama-';

export async function cacheDiorama(cityId: string, imageData: string): Promise<void> {
  await set(`${PREFIX}${cityId}`, imageData);
}

export async function getCachedDiorama(cityId: string): Promise<string | undefined> {
  return await get(`${PREFIX}${cityId}`);
}

export async function deleteCachedDiorama(cityId: string): Promise<void> {
  await del(`${PREFIX}${cityId}`);
}

export async function clearAllDioramas(): Promise<void> {
  const allKeys = await keys();
  for (const key of allKeys) {
    if (String(key).startsWith(PREFIX)) {
      await del(key);
    }
  }
}

export async function getCacheSize(): Promise<string> {
  try {
    const allKeys = await keys();
    let totalSize = 0;
    
    for (const key of allKeys) {
      if (String(key).startsWith(PREFIX)) {
        const data = await get(key);
        if (data && typeof data === 'string') {
          totalSize += new Blob([data]).size;
        }
      }
    }
    
    const sizeInKB = (totalSize / 1024).toFixed(2);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    return `${sizeInKB} KB (${sizeInMB} MB)`;
  } catch (error) {
    console.error('❌ Failed to get IndexedDB cache size:', error);
    return 'Unknown';
  }
}

export async function getCachedDioramaCount(): Promise<number> {
  try {
    const allKeys = await keys();
    return allKeys.filter(key => String(key).startsWith(PREFIX)).length;
  } catch (error) {
    console.error('❌ Failed to get cached diorama count:', error);
    return 0;
  }
}
