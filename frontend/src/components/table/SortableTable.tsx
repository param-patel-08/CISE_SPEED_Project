import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TableSortLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { Article } from '../article/Article'; // Assuming Article is the correct type for the data

interface SortableTableProps {
  data: Article[];
  onRowClick: (article: Article) => void; // onRowClick handler
}

const SortableTable: React.FC<SortableTableProps> = ({ data, onRowClick }) => {
  // Default headers to show initially
  const [visibleHeaders, setVisibleHeaders] = useState<(keyof Article)[]>([
    "JournalName",
    "Authors",
    "PubYear",
    "Impressions"
  ]);

  // All possible headers to show/hide
  const allHeaders: { key: keyof Article; label: string }[] = [
    { key: "JournalName", label: "Journal Name" },
    { key: "Authors", label: "Authors" },
    { key: "PubYear", label: "Publication Year" },
    { key: "Volume", label: "Volume" },
    { key: "Number", label: "Number" },
    { key: "Pages", label: "Pages" },
    { key: "Link", label: "Link" },
    { key: "SEPractice", label: "SE Practice" },
    { key: "Summary", label: "Summary" },
    { key: "Perspective", label: "Perspective" },
    { key: "Impressions", label: "Impressions" },
    { key: "DOE", label: "Date of Submission" }
  ];

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Article;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = React.useMemo(() => {
    if (sortConfig) {
      return [...data].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const handleSort = (key: keyof Article) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <Box>
      {/* Dropdown for selecting headers */}
      <FormControl style={{ minWidth: 200, marginBottom: 20 }}>
        <InputLabel>Select Columns</InputLabel>
        <Select
          multiple
          value={visibleHeaders}
          onChange={(event) => setVisibleHeaders(event.target.value as (keyof Article)[])}
          renderValue={(selected) =>
            (selected as (keyof Article)[]).map((key) => allHeaders.find((header) => header.key === key)?.label).join(", ")
          }
        >
          {allHeaders.map((header) => (
            <MenuItem key={header.key} value={header.key}>
              <Checkbox checked={visibleHeaders.includes(header.key)} />
              <ListItemText primary={header.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleHeaders.map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortConfig?.key === key}
                    direction={sortConfig?.key === key ? sortConfig.direction : "asc"}
                    onClick={() => handleSort(key)}
                  >
                    {allHeaders.find((header) => header.key === key)?.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, i) => (
              <TableRow key={i} hover onClick={() => onRowClick(row)} style={{ cursor: "pointer" }}>
                {visibleHeaders.map((key) => (
                  <TableCell key={key}>
                    {Array.isArray(row[key])
                      ? (row[key] as string[]).join(", ")
                      : row[key] instanceof Date
                      ? (row[key] as Date).toLocaleDateString() // Format the date
                      : row[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SortableTable;
