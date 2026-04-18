//Universeller Daten-Fetch-Hook zur Wiederverwendung von API-Aufrufen
//Verwaltet Ladezustand, Fehler und Daten sowie automatisches Fetchen bei Mount
import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFunction, autoFetch = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  //Führt den eigentlichen Datenabruf durch
   //Setzt Lade- und Fehlerzustand und speichert das Ergebnis
   //Wird mit useCallback memoisiert
  const fetchData = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Ein Fehler ist aufgetreten');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

//setzt den gesamten Zustand des Hooks zurück (Daten, Loading, Error)
//z.B. bei Filter-Änderungen oder wenn eine neue Suche gestartet wird
  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);


//Automatisches Fetchen beim ersten Rendern des Hooks
//falls autoFetch = true (Standardverhalten)
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData, reset, setData };
};