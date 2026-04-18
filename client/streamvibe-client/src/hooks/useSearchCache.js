//Verwaltet einen sessionStorage-basierten Cache für Suchergebnisse
//Speichert Query, Ergebnisse, Scroll-Position und Timestamp
//Verhindert unnötige API-Aufrufe bei wiederholten identischen Suchen
import { useCallback } from 'react';

const CACHE_KEY = 'search_results_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 Minuten Gültigkeitsdauer

export const useSearchCache = () => {

  //Speichert Suchergebnisse im sessionStorage
  //Wird verwendet, wenn der User auf der Suchseite scrollt oder die Seite verlässt
  const saveCache = useCallback((query, results, scrollPosition) => {
    if (!query || !results) return;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      query,
      results,
      scrollPosition,
      timestamp: Date.now()
    }));
  }, []);

  //Liest den Cache aus und prüft auf Gültigkeit
  const getCache = useCallback((query) => {
    const cacheStr = sessionStorage.getItem(CACHE_KEY);
    if (cacheStr) {
      try {
        const cache = JSON.parse(cacheStr);
        const isFresh = Date.now() - cache.timestamp < CACHE_TTL;

        if (isFresh && cache.query === query) {
          return cache; // { query, results, scrollPosition, timestamp }
        }
      } catch (e) {
        console.error('Cache parsing error:', e);
      }
    }
    return null;
  }, []);

  //Löscht den gesamten Such-Cache
  //bei völlig neuer Suche oder beim Verlassen der Suchseite
  const clearCache = useCallback(() => {
    sessionStorage.removeItem(CACHE_KEY);
  }, []);

  return { saveCache, getCache, clearCache };
};