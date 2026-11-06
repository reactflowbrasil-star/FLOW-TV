import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clock3,
  Info,
  ListPlus,
  Play,
  Plus,
  Search,
  X
} from "lucide-react";
import { films } from "./catalog.js";

const LIST_KEY = "flowtv-list";
const PROGRESS_KEY = "flowtv-progress";
const HERO_IMAGE = `${import.meta.env.BASE_URL}hero-titan.webp`;

function readStore(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function FilmCard({ film, onOpen, inList, onToggleList, progress }) {
  const percent = progress?.duration ? Math.min(100, (progress.time / progress.duration) * 100) : 0;
  return (
    <article className="film-card">
      <button className="poster-button" onClick={() => onOpen(film)} aria-label={`Abrir ${film.title}`}>
        <img className="poster" src={film.poster} alt={`Cartaz de ${film.title}`} loading="lazy" />
        <span className="poster-shade" />
        <span className="poster-play"><Play size={17} fill="currentColor" /></span>
        <span className="poster-label">{film.type}</span>
        {percent > 0 && <span className="progress-track"><span style={{ width: `${percent}%` }} /></span>}
      </button>
      <div className="film-card-info">
        <button className="film-title" onClick={() => onOpen(film)}>{film.title}</button>
        <button
          className={`list-toggle ${inList ? "selected" : ""}`}
          onClick={() => onToggleList(film.id)}
          aria-label={inList ? `Remover ${film.title} da minha lista` : `Adicionar ${film.title} à minha lista`}
          title={inList ? "Remover da minha lista" : "Adicionar à minha lista"}
        >
          {inList ? <Check size={17} /> : <Plus size={17} />}
        </button>
      </div>
      <div className="film-meta">{film.year} <span>·</span> {film.duration} <span>·</span> Acesso aberto</div>
    </article>
  );
}

function FilmRail({ title, items, onOpen, list, onToggleList, progress }) {
  const railRef = useRef(null);
  if (!items.length) return null;
  const move = (direction) => railRef.current?.scrollBy({ left: direction * railRef.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="rail-section">
      <div className="rail-heading">
        <h2>{title}</h2>
        <div className="rail-controls">
          <button onClick={() => move(-1)} aria-label={`Rolar ${title} para a esquerda`}><ChevronLeft size={18} /></button>
          <button onClick={() => move(1)} aria-label={`Rolar ${title} para a direita`}><ChevronRight size={18} /></button>
        </div>
      </div>
      <div className="film-rail" ref={railRef}>
        {items.map((film) => (
          <FilmCard key={film.id} film={film} onOpen={onOpen} inList={list.includes(film.id)} onToggleList={onToggleList} progress={progress[film.id]} />
        ))}
      </div>
    </section>
  );
}

function PlayerDialog({ film, onClose, onProgress }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (!film) return;
    const node = videoRef.current;
    const saved = readStore(PROGRESS_KEY, {})[film.id];
    const restore = () => {
      if (saved?.time > 8 && saved.time < node.duration - 20) node.currentTime = saved.time;
    };
    node?.addEventListener("loadedmetadata", restore);
    return () => node?.removeEventListener("loadedmetadata", restore);
  }, [film]);

  if (!film) return null;
  return (
    <div className="player-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="player-dialog" role="dialog" aria-modal="true" aria-label={film.title}>
        <button className="dialog-close" onClick={onClose} aria-label="Fechar player"><X size={22} /></button>
        <video
          ref={videoRef}
          className="video-player"
          controls
          autoPlay
          playsInline
          poster={film.poster}
          src={film.video}
          onTimeUpdate={(event) => onProgress(film.id, event.currentTarget.currentTime, event.currentTarget.duration)}
          onEnded={() => onProgress(film.id, 0, 0)}
        >
          Seu navegador não oferece suporte a vídeo HTML5.
        </video>
        <div className="player-caption">
          <div>
            <p className="eyebrow">FILME DE ACESSO ABERTO</p>
            <h2>{film.title}</h2>
            <p>{film.credit} <a href={film.source} target="_blank" rel="noreferrer">Ver fonte e licença</a></p>
          </div>
          <span>{film.year} · {film.duration}</span>
        </div>
      </section>
    </div>
  );
}

function FilmDetails({ film, onClose, onPlay, inList, onToggleList }) {
  if (!film) return null;
  return (
    <div className="details-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="details-dialog" role="dialog" aria-modal="true" aria-label={`Detalhes de ${film.title}`}>
        <div className="details-art" style={{ backgroundImage: `linear-gradient(0deg,#111 1%,transparent 68%),url("${film.poster}")` }}>
          <button className="dialog-close" onClick={onClose} aria-label="Fechar detalhes"><X size={22} /></button>
          <div className="details-title">
            <p className="eyebrow">FLOWTV · CINEMA ABERTO</p>
            <h2>{film.title}</h2>
          </div>
        </div>
        <div className="details-content">
          <div className="details-actions">
            <button className="button button-primary" onClick={onPlay}><Play size={18} fill="currentColor" /> Assistir</button>
            <button className="button button-secondary" onClick={() => onToggleList(film.id)}>
              {inList ? <Check size={18} /> : <Plus size={18} />} {inList ? "Na minha lista" : "Minha lista"}
            </button>
          </div>
          <div className="details-meta"><span>{film.year}</span><span>{film.duration}</span><span>{film.rating}</span><span>{film.type}</span></div>
          <p className="details-synopsis">{film.synopsis}</p>
          <p className="license-copy">{film.credit} <a href={film.source} target="_blank" rel="noreferrer">Créditos completos</a></p>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState("Início");
  const [query, setQuery] = useState("");
  const [list, setList] = useState(() => readStore(LIST_KEY, []));
  const [progress, setProgress] = useState(() => readStore(PROGRESS_KEY, {}));
  const [detailFilm, setDetailFilm] = useState(null);
  const [playerFilm, setPlayerFilm] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const searchRef = useRef(null);
  const catalogRef = useRef(null);

  useEffect(() => localStorage.setItem(LIST_KEY, JSON.stringify(list)), [list]);
  useEffect(() => localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)), [progress]);

  const toggleList = (id) => setList((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const saveProgress = (id, time, duration) => {
    setProgress((current) => {
      const next = { ...current };
      if (!duration || time < 3 || time >= duration - 12) delete next[id];
      else next[id] = { time, duration };
      return next;
    });
  };
  const openFilm = (film) => setDetailFilm(film);
  const playFilm = (film) => { setDetailFilm(null); setPlayerFilm(film); };
  const closePlayer = () => setPlayerFilm(null);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") { setPlayerFilm(null); setDetailFilm(null); setMobileMenu(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const matches = useMemo(() => films.filter((film) => {
    const found = `${film.title} ${film.type} ${film.synopsis}`.toLocaleLowerCase("pt-BR").includes(query.trim().toLocaleLowerCase("pt-BR"));
    if (!found) return false;
    if (activeView === "Filmes") return true;
    if (activeView === "Minha lista") return list.includes(film.id);
    return true;
  }), [query, activeView, list]);

  const continueWatching = films.filter((film) => progress[film.id]?.time);
  const chosenList = films.filter((film) => list.includes(film.id));
  const browse = () => catalogRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="#inicio" onClick={() => { setActiveView("Início"); setQuery(""); }} aria-label="FLOWTV início">
          FLOWTV<span className="wordmark-wave">⌁</span>
        </a>
        <button className="mobile-menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Abrir navegação"><ChevronDown size={18} /></button>
        <nav className={`main-nav ${mobileMenu ? "open" : ""}`} aria-label="Navegação principal">
          {["Início", "Filmes", "Minha lista"].map((item) => (
            <button key={item} className={activeView === item ? "active" : ""} onClick={() => { setActiveView(item); setQuery(""); setMobileMenu(false); }}>
              {item === "Minha lista" && <ListPlus size={17} />} {item}
            </button>
          ))}
        </nav>
        <label className="search-box">
          <Search size={18} />
          <input ref={searchRef} value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value) setActiveView("Início"); }} placeholder="Buscar títulos" aria-label="Buscar filmes" />
          <kbd>⌘ K</kbd>
        </label>
        <button className="profile-button" aria-label="Perfil"><span>F</span><ChevronDown size={15} /></button>
      </header>

      {query ? (
        <main className="search-results">
          <p className="eyebrow">CATÁLOGO FLOWTV</p>
          <h1>Resultados para “{query}”</h1>
          {matches.length ? (
            <div className="results-grid">{matches.map((film) => <FilmCard key={film.id} film={film} onOpen={openFilm} inList={list.includes(film.id)} onToggleList={toggleList} progress={progress[film.id]} />)}</div>
          ) : <div className="empty-state"><Search size={26} /><h2>Nenhum título encontrado</h2><p>Tente buscar por animação, fantasia ou ficção científica.</p></div>}
        </main>
      ) : activeView === "Minha lista" ? (
        <main className="search-results list-page">
          <p className="eyebrow">SUA CURADORIA</p>
          <h1>Minha lista</h1>
          {chosenList.length ? <div className="results-grid">{chosenList.map((film) => <FilmCard key={film.id} film={film} onOpen={openFilm} inList onToggleList={toggleList} progress={progress[film.id]} />)}</div> : <div className="empty-state"><ListPlus size={26} /><h2>Comece sua lista</h2><p>Use o botão + nos filmes para guardar o que quer assistir depois.</p><button className="button button-primary" onClick={() => { setActiveView("Início"); browse(); }}>Explorar filmes</button></div>}
        </main>
      ) : activeView === "Filmes" ? (
        <main className="search-results list-page">
          <p className="eyebrow">CATÁLOGO FLOWTV</p>
          <h1>Filmes</h1>
          <div className="results-grid">{matches.map((film) => <FilmCard key={film.id} film={film} onOpen={openFilm} inList={list.includes(film.id)} onToggleList={toggleList} progress={progress[film.id]} />)}</div>
        </main>
      ) : (
        <>
          <main id="inicio">
            <section className="hero" style={{ "--hero-image": `url("${HERO_IMAGE}")` }}>
              <div className="hero-content">
                <p className="eyebrow">FILMES PARA DESCOBRIR</p>
                <h1>Seu próximo filme<br />começa aqui.</h1>
                <p className="hero-copy">Uma seleção de histórias abertas, curtas independentes e animações para assistir sem assinatura.</p>
                <div className="hero-actions">
                  <button className="button button-primary" onClick={browse}><Play size={18} fill="currentColor" /> Explorar filmes</button>
                  <button className="button button-secondary" onClick={() => setActiveView("Filmes")}><Info size={18} /> Sobre o catálogo</button>
                </div>
                <div className="hero-note"><Clapperboard size={15} /><span>Obras abertas com créditos e licenças indicados</span></div>
              </div>
              <button className="hero-scroll" onClick={browse} aria-label="Ir para o catálogo"><ArrowDown size={17} /></button>
            </section>

            <div className="catalog-area" ref={catalogRef} id="catalogo">
              {continueWatching.length > 0 && <FilmRail title="Continue assistindo" items={continueWatching} onOpen={openFilm} list={list} onToggleList={toggleList} progress={progress} />}
              <FilmRail title="Histórias para começar" items={films} onOpen={openFilm} list={list} onToggleList={toggleList} progress={progress} />
              <FilmRail title="Animação e fantasia" items={films.filter((film) => ["Animação", "Fantasia"].includes(film.type))} onOpen={openFilm} list={list} onToggleList={toggleList} progress={progress} />
              <FilmRail title="Ficção científica" items={films.filter((film) => film.type === "Ficção científica")} onOpen={openFilm} list={list} onToggleList={toggleList} progress={progress} />
              {chosenList.length > 0 && <FilmRail title="Minha lista" items={chosenList} onOpen={openFilm} list={list} onToggleList={toggleList} progress={progress} />}
            </div>
          </main>
          <footer className="site-footer">
            <a className="footer-mark" href="#inicio">FLOWTV<span>⌁</span></a>
            <p>Projeto de demonstração com filmes de acesso aberto.</p>
            <div className="credits">
              {films.map((film) => <a key={film.id} href={film.source} target="_blank" rel="noreferrer">{film.credit}</a>)}
            </div>
            <span className="copyright">FLOWTV · Catálogo independente</span>
          </footer>
        </>
      )}
      <FilmDetails film={detailFilm} onClose={() => setDetailFilm(null)} onPlay={() => playFilm(detailFilm)} inList={detailFilm ? list.includes(detailFilm.id) : false} onToggleList={toggleList} />
      <PlayerDialog film={playerFilm} onClose={closePlayer} onProgress={saveProgress} />
    </div>
  );
}
