import type { FunctionComponent } from "react";
import { useMemo, useState } from "react";
import type { Wine } from "../../../../models/wines";
import WineDetailsModal from "../WineDetailsModal/index";
import styles from "./index.module.scss";

interface WineTableProps {
  wines?: Wine[];
}

type SortField = keyof Wine;
type SortDirection = "asc" | "desc";

const WineTable: FunctionComponent<WineTableProps> = ({ wines }) => {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [showWineDetails, setShowWineDetails] = useState(false);

  const filteredAndSortedWines = useMemo(() => {
    // First filter wines based on search term
    const filtered = wines?.filter((wine) => {
      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        wine.name.toLowerCase().includes(searchLower) ||
        wine.country.toLowerCase().includes(searchLower) ||
        wine.region.toLowerCase().includes(searchLower) ||
        wine.grape.toLowerCase().includes(searchLower) ||
        wine.kind.toLowerCase().includes(searchLower) ||
        wine.location.toLowerCase().includes(searchLower) ||
        new Date(wine.bought)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower) ||
        wine.year.toString().includes(searchLower)
      );
    });

    // Then sort the filtered results
    return filtered?.sort((a, b) => {
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

  const handleWineClick = (wine: Wine) => {
    setSelectedWine(wine);
    setShowWineDetails(true);
  };

  const handleCloseWineDetails = () => {
    setShowWineDetails(false);
    setSelectedWine(null);
  };

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Søg vine..."
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
          <option value="name-asc">Navn (A-Z)</option>
          <option value="name-desc">Navn (Z-A)</option>
          <option value="year-desc">År (Nyeste)</option>
          <option value="year-asc">År (Ældste)</option>
          <option value="country-asc">Land (A-Z)</option>
          <option value="country-desc">Land (Z-A)</option>
          <option value="region-asc">Region (A-Z)</option>
          <option value="region-desc">Region (Z-A)</option>
          <option value="grape-asc">Drue (A-Z)</option>
          <option value="grape-desc">Drue (Z-A)</option>
          <option value="kind-asc">Type (A-Z)</option>
          <option value="kind-desc">Type (Z-A)</option>
          <option value="location-asc">Placering (A-Z)</option>
          <option value="location-desc">Placering (Z-A)</option>
          <option value="bought-desc">Købt (Nyeste)</option>
          <option value="bought-asc">Købt (Ældste)</option>
          <option value="quantity-desc">Antal (Flest)</option>
          <option value="quantity-asc">Antal (Færrest)</option>
          <option value="remaining-desc">Tilbage (Flest)</option>
          <option value="remaining-asc">Tilbage (Færrest)</option>
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
                Navn{getSortIcon("name")}
              </th>
              <th
                onClick={() => handleSort("year")}
                className={styles.sortable}
              >
                År{getSortIcon("year")}
              </th>
              <th
                onClick={() => handleSort("country")}
                className={styles.sortable}
              >
                Land{getSortIcon("country")}
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
                Drue{getSortIcon("grape")}
              </th>
              <th
                onClick={() => handleSort("kind")}
                className={styles.sortable}
              >
                Type{getSortIcon("kind")}
              </th>
              <th
                onClick={() => handleSort("location")}
                className={styles.sortable}
              >
                Placering{getSortIcon("location")}
              </th>
              <th
                onClick={() => handleSort("bought")}
                className={styles.sortable}
              >
                Købt{getSortIcon("bought")}
              </th>
              <th
                onClick={() => handleSort("quantity")}
                className={styles.sortable}
              >
                Antal{getSortIcon("quantity")}
              </th>
              <th
                onClick={() => handleSort("remaining")}
                className={styles.sortable}
              >
                Tilbage{getSortIcon("remaining")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedWines?.map((wine, index) => (
              <tr
                key={`${wine.name}-${wine.year}-${index}`}
                className={styles.clickableRow}
                onClick={() => handleWineClick(wine)}
              >
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
                <td>{wine.location}</td>
                <td>{new Date(wine.bought).toLocaleDateString()}</td>
                <td>{wine.quantity}</td>
                <td>
                  {wine.remaining !== undefined ? (
                    <span
                      className={`${styles.quantityBadge} ${
                        wine.remaining === 0 ? styles.empty : ""
                      }`}
                    >
                      {wine.remaining}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSortedWines?.length === 0 && searchTerm && (
          <div className={styles.emptyState}>
            <p>Ingen vine fundet der matcher "{searchTerm}".</p>
          </div>
        )}
        {wines?.length === 0 && (
          <div className={styles.emptyState}>
            <p>Ingen vine i kælderen endnu.</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {filteredAndSortedWines?.map((wine, index) => (
          <div
            key={`${wine.name}-${wine.year}-${index}`}
            className={`${styles.wineCard} ${styles.clickableCard}`}
            onClick={() => handleWineClick(wine)}
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
                <span className={styles.cardLabel}>Oprindelse:</span>
                <span>
                  {wine.country}, {wine.region}
                </span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Drue:</span>
                <span>{wine.grape}</span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Placering:</span>
                <span>{wine.location}</span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardLabel}>Købt:</span>
                <span>{new Date(wine.bought).toLocaleDateString()}</span>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.quantityInfo}>
                  <span className={styles.cardLabel}>Antal:</span>
                  <span>{wine.quantity}</span>
                </div>
                <div className={styles.quantityInfo}>
                  <span className={styles.cardLabel}>Tilbage:</span>
                  {wine.remaining !== undefined ? (
                    <span
                      className={`${styles.quantityBadge} ${
                        wine.remaining === 0 ? styles.empty : ""
                      }`}
                    >
                      {wine.remaining}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAndSortedWines?.length === 0 && searchTerm && (
          <div className={styles.emptyState}>
            <p>Ingen vine fundet der matcher "{searchTerm}".</p>
          </div>
        )}
        {wines?.length === 0 && (
          <div className={styles.emptyState}>
            <p>Ingen vine i kælderen endnu.</p>
          </div>
        )}
      </div>

      {selectedWine && (
        <WineDetailsModal
          wine={selectedWine}
          isOpen={showWineDetails}
          onClose={handleCloseWineDetails}
        />
      )}
    </>
  );
};

export default WineTable;
