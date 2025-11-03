import type { FunctionComponent } from "react";
import { useMemo, useState } from "react";
import type { Wine } from "../../models/wines";
import styles from "./index.module.scss";

interface WineTableProps {
  wines: Wine[];
}

type SortField = keyof Wine;
type SortDirection = "asc" | "desc";

const WineTable: FunctionComponent<WineTableProps> = ({ wines }) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedWines = useMemo(() => {
    // First filter wines based on search term
    const filtered = wines.filter((wine) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        wine.name.toLowerCase().includes(searchLower) ||
        wine.country.toLowerCase().includes(searchLower) ||
        wine.region.toLowerCase().includes(searchLower) ||
        wine.grape.toLowerCase().includes(searchLower) ||
        wine.kind.toLowerCase().includes(searchLower) ||
        wine.boughtAt
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower) ||
        wine.year.toString().includes(searchLower)
      );
    });

    // Then sort the filtered results
    return filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return sortDirection === "asc" ? 1 : -1;
      if (bValue === undefined) return sortDirection === "asc" ? -1 : 1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [wines, sortField, sortDirection, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search wines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Mobile Sort Controls */}
      <div className={styles.mobileSortContainer}>
        <select
          value={`${sortField}-${sortDirection}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split("-") as [
              SortField,
              SortDirection
            ];
            setSortField(field);
            setSortDirection(direction);
          }}
          className={styles.mobileSortSelect}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="year-desc">Year (Newest)</option>
          <option value="year-asc">Year (Oldest)</option>
          <option value="country-asc">Country (A-Z)</option>
          <option value="country-desc">Country (Z-A)</option>
          <option value="region-asc">Region (A-Z)</option>
          <option value="region-desc">Region (Z-A)</option>
          <option value="grape-asc">Grape (A-Z)</option>
          <option value="grape-desc">Grape (Z-A)</option>
          <option value="kind-asc">Kind (A-Z)</option>
          <option value="kind-desc">Kind (Z-A)</option>
          <option value="boughtAt-desc">Bought (Newest)</option>
          <option value="boughtAt-asc">Bought (Oldest)</option>
          <option value="quantity-desc">Quantity (Most)</option>
          <option value="quantity-asc">Quantity (Least)</option>
          <option value="quantityLeft-desc">Remaining (Most)</option>
          <option value="quantityLeft-asc">Remaining (Least)</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                className={styles.sortable}
              >
                Name{getSortIcon("name")}
              </th>
              <th
                onClick={() => handleSort("year")}
                className={styles.sortable}
              >
                Year{getSortIcon("year")}
              </th>
              <th
                onClick={() => handleSort("country")}
                className={styles.sortable}
              >
                Country{getSortIcon("country")}
              </th>
              <th
                onClick={() => handleSort("region")}
                className={styles.sortable}
              >
                Region{getSortIcon("region")}
              </th>
              <th
                onClick={() => handleSort("grape")}
                className={styles.sortable}
              >
                Grape{getSortIcon("grape")}
              </th>
              <th
                onClick={() => handleSort("kind")}
                className={styles.sortable}
              >
                Kind{getSortIcon("kind")}
              </th>
              <th
                onClick={() => handleSort("boughtAt")}
                className={styles.sortable}
              >
                Bought{getSortIcon("boughtAt")}
              </th>
              <th
                onClick={() => handleSort("quantity")}
                className={styles.sortable}
              >
                Quantity{getSortIcon("quantity")}
              </th>
              <th
                onClick={() => handleSort("quantityLeft")}
                className={styles.sortable}
              >
                Remaining{getSortIcon("quantityLeft")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedWines.map((wine, index) => (
              <tr key={`${wine.name}-${wine.year}-${index}`}>
                <td className={styles.wineName}>{wine.name}</td>
                <td>{wine.year}</td>
                <td>{wine.country}</td>
                <td>{wine.region}</td>
                <td>{wine.grape}</td>
                <td>
                  <span
                    className={`${styles.kindBadge} ${
                      styles[wine.kind.toLowerCase()]
                    }`}
                  >
                    {wine.kind}
                  </span>
                </td>
                <td>{wine.boughtAt.toLocaleDateString()}</td>
                <td>{wine.quantity}</td>
                <td>
                  {wine.quantityLeft !== undefined ? (
                    <span
                      className={`${styles.quantityBadge} ${
                        wine.quantityLeft === 0 ? styles.empty : ""
                      }`}
                    >
                      {wine.quantityLeft}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSortedWines.length === 0 && searchTerm && (
          <div className={styles.emptyState}>
            <p>No wines found matching "{searchTerm}".</p>
          </div>
        )}
        {wines.length === 0 && (
          <div className={styles.emptyState}>
            <p>No wines in the cellar yet.</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {filteredAndSortedWines.map((wine, index) => (
          <div
            key={`${wine.name}-${wine.year}-${index}`}
            className={styles.wineCard}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardWineName}>{wine.name}</h3>
              <span className={styles.cardYear}>{wine.year}</span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Type:</span>
                <span
                  className={`${styles.kindBadge} ${
                    styles[wine.kind.toLowerCase()]
                  }`}
                >
                  {wine.kind}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Origin:</span>
                <span>
                  {wine.country}, {wine.region}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Grape:</span>
                <span>{wine.grape}</span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Bought:</span>
                <span>{wine.boughtAt.toLocaleDateString()}</span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.quantityInfo}>
                  <span className={styles.cardLabel}>Quantity:</span>
                  <span>{wine.quantity}</span>
                </div>
                <div className={styles.quantityInfo}>
                  <span className={styles.cardLabel}>Remaining:</span>
                  {wine.quantityLeft !== undefined ? (
                    <span
                      className={`${styles.quantityBadge} ${
                        wine.quantityLeft === 0 ? styles.empty : ""
                      }`}
                    >
                      {wine.quantityLeft}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAndSortedWines.length === 0 && searchTerm && (
          <div className={styles.emptyState}>
            <p>No wines found matching "{searchTerm}".</p>
          </div>
        )}
        {wines.length === 0 && (
          <div className={styles.emptyState}>
            <p>No wines in the cellar yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default WineTable;
