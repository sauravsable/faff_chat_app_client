import { useState } from "react";
import { useQuery, useQueryClient  } from "@tanstack/react-query";
import { semanticSearch } from "../../utils/api";
import "./Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch  } = useQuery({
    queryKey: ["semantic-search", searchText],
    queryFn: () => semanticSearch(searchText),
    enabled: false,
  });

  const handleSearch = () => {
    if (!query.trim()) return; // avoid empty searches
    setSearchText(query);
    refetch();
  };

   const handleClear = () => {
    setQuery("");
    setSearchText("");
    queryClient.removeQueries({ queryKey: ["semantic-search"] }); // clears cached results
  };

  return (
    <div className="semantic-container">
      <h2 className="semantic-title">🔍 Semantic Search</h2>

      <div className="semantic-search-bar">
        <input
          type="text"
          placeholder="Search messages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="semantic-input"
        />
        <button onClick={handleSearch} className="semantic-button">
          Search
        </button>
        <button onClick={handleClear} className="semantic-button">
          Clear
        </button>
      </div>

      {isLoading && <p className="semantic-loading">Searching...</p>}
      {isError && <p className="semantic-error">⚠️ Something went wrong.</p>}

      {data && (
        <ul className="semantic-results">
          {data?.map((item) => (
            <li key={item.id} className="semantic-card">
              <p className="semantic-message">{item.message}</p>
              <p className="semantic-meta">
                <span>Score: {item.score.toFixed(3)}</span> |{" "}
                <span>Sender: {item.senderId}</span> →{" "}
                <span>Receiver: {item.receiverId}</span>
              </p>
              {item.createdAt && (
                <p className="semantic-date">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {data && data.length === 0 && !isLoading && (
        <p className="semantic-empty">No results found.</p>
      )}
    </div>
  );
}
