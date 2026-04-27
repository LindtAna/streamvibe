import './SearchPage.scss';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { apiService } from '../../../api/api';
import { useFetch } from '../../../hooks/useFetch';
import { useSearchCache } from '../../../hooks/useSearchCache';

import MovieCard from '../../components/MovieCard';
import SerieCard from '../../components/SerieCard';

//Verarbeitet Suchanfragen, lädt Ergebnisse über TMDB-API, verwendet Caching
//stellt die Scroll-Position bei wiederholtem Aufruf derselben Suche wieder her
const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    // Custom Hooks für Datenabruf und Caching
    const { data: results, loading, error, refetch, setData, reset } = useFetch(apiService.searchTMDB, false);
    const { saveCache, getCache, clearCache } = useSearchCache();



    ////////// Scroll-Position Management ///
    const hasRestoredScrollRef = useRef(false);
    // Speichert die aktuelle Scroll-Position des Users in Echtzeit
    const scrollPosRef = useRef(0);

    //Überwacht den Scroll des Users kontinuierlich und speichert die Position
    //Wird mit { passive: true } optimiert, um die Performance nicht zu beeinträchtigen
    useEffect(() => {
        const handleScroll = () => {
            scrollPosRef.current = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    //// Haupt-Logik: Suchen, Caching und Scroll-Restore ///
    //1. Bei leerer Query -> alles zurücksetzen
    //2. Bei vorhandenem gültigem Cache -> Daten aus Cache laden + Scroll-Position wiederherstellen
    //3. Sonst -> frische API-Anfrage + Scroll auf Anfang
    useEffect(() => {
        if (!query) {
            reset();
            clearCache();
            return;
        }

        const cachedData = getCache(query);

        if (cachedData) {
            // Cache-Treffer: Daten direkt setzen und Scroll-Position wiederherstellen
            setData(cachedData.results);
            if (cachedData.scrollPosition !== undefined && !hasRestoredScrollRef.current) {
                // behavior: 'instant', verhindert Scroll-Animation-Flackern beim Restore
                setTimeout(() => {
                    window.scrollTo({ top: cachedData.scrollPosition, behavior: 'instant' });
                }, 50);
                hasRestoredScrollRef.current = true;
            }
        } else {
            // Kein Cache oder Cache veraltet -> neue Suche starten
            hasRestoredScrollRef.current = false;
            refetch(query).then(() => {
                window.scrollTo(0, 0);
            });
        }
    }, [query, getCache, clearCache, refetch, setData, reset]);

  //Speichert den aktuellen Suchzustand (Ergebnisse + Scroll-Position) 
  // beim Verlassen der Seite (unmount) im sessionStorage
    useEffect(() => {
        return () => {
            if (query && results) {
                saveCache(query, results, scrollPosRef.current);
            }
        };
    }, [query, results, saveCache]);

// Hilfsvariablen für Rendering
    const hasResults = results && (results.movies?.length > 0 || results.series?.length > 0);
    const noResults = results && !hasResults && !loading;

    return (
        <div className="search-page container">
            {loading && <div className="search-page__loading">Vorspann läuft...</div>}
            {error && <div className="search-page__error">{error}</div>}
            {noResults && (
                <div className="search-page__empty">
                    Keine Ergebnisse für "{query}" gefunden.
                </div>
            )}

            {hasResults && !loading && (
                <div className="search-page__results">
                    <div className="search-page__results-header">
                        <h1 className='h5'>{results.total} Ergebnisse für "{query}" gefunden</h1>
                    </div>

                    {results.movies?.length > 0 && (
                        <div className="search-page__section">
                            <h2 className="search-page__section-title h3">Filme ({results.movies.length})</h2>
                            <div className="search-page__results-grid">
                                {results.movies.map((movie) => (
                                    <MovieCard
                                        key={movie.id}
                                        title={movie.title}
                                        imgSrc={movie.poster_path || null}
                                        released={movie.release_date ? new Date(movie.release_date).getFullYear() : ''}
                                        rating={{ value: movie.rating, iconName: 'star' }}
                                        href={`/movie/${movie.id}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {results.series?.length > 0 && (
                        <div className="search-page__section">
                            <h2 className="search-page__section-title h3">Serien ({results.series.length})</h2>
                            <div className="search-page__results-grid">
                                {results.series.map((serie) => (
                                    <SerieCard
                                        key={serie.id}
                                        title={serie.title}
                                        imgSrc={serie.poster_path || null}
                                        released={serie.first_air_date ? new Date(serie.first_air_date).getFullYear() : ''}
                                        rating={{ value: serie.rating, iconName: 'star' }}
                                        href={`/serie/${serie.id}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchPage