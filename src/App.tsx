import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { PacmanLoader } from "react-spinners";

interface PokemonCard {
  id: string;
  name: string;
  images: {
    large: string;
    small: string;
  };
  types?: string[];
  attacks?: { name: string; cost: string[]; damage: string; text?: string }[];
  rarity?: string;
  hp?: string;
}

const API_URL = 'https://api.pokemontcg.io/v2/cards';
const API_KEY = 'd85327a1-36f4-4698-943a-a5a4340d37ed';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [favorites, setFavorites] = useState<PokemonCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const fetchCards = async (
    pageNumber: number = 1,
    searchQuery: string = '',
    cardType: string = ''
  ) => {
    setLoading(true);
    setError('');
    setCards([]);
    try {
      const queryParts: string[] = [];
      if (searchQuery) queryParts.push(`name:${searchQuery}`);
      if (cardType) queryParts.push(`types:${cardType}`);
      const queryString =
        queryParts.length > 0 ? queryParts.join(' ') : undefined;

      const response = await axios.get(`${API_URL}`, {
        params: {
          page: pageNumber,
          pageSize: 10,
          q: queryString,
        },
        headers: {
          'X-Api-Key': API_KEY,
        },
      });

      if (response.data.data.length > 0) {
        setCards(response.data.data);
        setPage(pageNumber);
      } else {
        setError('Aucune carte trouvée.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    fetchCards(1, query, type);
  };

  const toggleFavorite = (card: PokemonCard) => {
    setFavorites((prevFavorites) =>
      prevFavorites.some((fav) => fav.id === card.id)
        ? prevFavorites.filter((fav) => fav.id !== card.id)
        : [...prevFavorites, card]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Pokédex</h1>
        <form onSubmit={handleSearch} className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Rechercher un Pokémon..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border rounded-l-lg px-4 py-2 w-80"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="type border-t border-b px-2"
            disabled={query.length > 0}
          >
            <option value="">Tous les types</option>
            <option value="Fire">Feu</option>
            <option value="Water">Eau</option>
            <option value="Grass">Plante</option>
            <option value="Electric">Électrique</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition">
            Chercher
          </button>
        </form>
      </header>

      {loading && (
        <div className="flex justify-center my-6">
          <PacmanLoader color="#3b82f6" />
        </div>
      )}

      {error && <div className="text-red-600 text-center my-4">{error}</div>}

      <div className="grid grid-cols-5 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-container"
            onClick={() => setSelectedCard(card)}
          >
            <div className="card">
              <div className="card-front">
                <img
                  src={card.images.large}
                  alt={card.name}
                  className="w-full"
                />
              </div>
              <div className="card-back"></div>
            </div>
          </div>
        ))}
      </div>

      {cards.length > 0 && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => fetchCards(page - 1, query, type)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span className="text-gray-700">Page {page}</span>
          <button
            onClick={() => fetchCards(page + 1, query, type)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Suivant
          </button>
        </div>
      )}

      <div className="my-6">
        <h2 className="text-2xl font-bold mb-4">Mes Favoris</h2>
        <div className="grid grid-cols-5 gap-6">
          {favorites.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md p-4">
              <img
                src={card.images.large}
                alt={card.name}
                className="w-full cursor-pointer hover:scale-105 transition-transform mb-2"
                onClick={() => setSelectedCard(card)}
              />
              <button
                onClick={() => toggleFavorite(card)}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Retirer
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 relative w-1/2">
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
              onClick={() => setSelectedCard(null)}
            >
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedCard.name}</h2>
            <img
              src={selectedCard.images.small}
              alt={selectedCard.name}
              className="w-50 h-50 mx-auto"
            />
            <p className="mt-4 text-gray-700">
              <strong>Rareté :</strong> {selectedCard.rarity || 'Inconnue'}
            </p>
            <p className="text-gray-700">
              <strong>HP :</strong> {selectedCard.hp || 'Inconnu'}
            </p>
            {selectedCard.types && (
              <p className="text-gray-700">
                <strong>Types :</strong> {selectedCard.types.join(', ')}
              </p>
            )}
            {selectedCard.attacks?.map((attack, index) => (
              <li key={index} className="text-gray-700">
                <strong>{attack.name}</strong> - Coût :{' '}
                {attack.cost?.join(', ') || 'Aucun'} - Dégâts :{' '}
                {attack.damage || 'Aucun'}
                {attack.text && <p className="italic">{attack.text}</p>}
              </li>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(selectedCard);
              }}
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              {favorites.some((fav) => fav.id === selectedCard.id)
                ? 'Retirer'
                : 'Ajouter aux favoris'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
