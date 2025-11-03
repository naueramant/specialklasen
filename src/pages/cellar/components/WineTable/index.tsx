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
