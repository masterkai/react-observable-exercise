import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { deck$, Pokemon, pokemon$, selected$ } from "./store";
import { useObservableState } from "observable-hooks";

const Deck = () => {
  const deck = useObservableState(deck$, []);
  return (
    <div>
      <h4>Deck</h4>
      <div>
        {deck.map((p) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center" }}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
            />
            <div>
              <div>{p.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const Search = () => {
    const [search, setSearch] = useState("");
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    useEffect(() => {
        const subscription = pokemon$.subscribe(setPokemon);
        return () => subscription.unsubscribe();
    }, []);

    const filteredPokemon = useMemo(() => {
        return pokemon.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, pokemon]);

    return (
        <div>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div
                style={{
                    maxHeight: "70vh",
                    overflow: "scroll",
                }}
            >
                {filteredPokemon.map((p) => (
                    <div key={p.name}>
                        <input
                            type="checkbox"
                            checked={p.selected}
                            onChange={() => {
                                console.log(selected$);
                                if (selected$.value.includes(p.id)) {
                                    selected$.next(selected$.value.filter((id) => id !== p.id));
                                } else {
                                    selected$.next([...selected$.value, p.id]);
                                }
                            }}
                        />
                        <strong>{p.name}</strong> - {p.power}
                    </div>
                ))}
            </div>
        </div>
    );
};

function App() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
            }}
        >
            <Search/>
            <Deck/>
        </div>
    );
}

export default App;
