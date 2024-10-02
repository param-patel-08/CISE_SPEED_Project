import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";

interface SortableTableProps {
  headers: { key: string; label: string }[];
  data: any[];
}

const SortableTable: React.FC<SortableTableProps> = ({ headers, data }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableCell key={header.key}>{header.label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
            {headers.map((header) => (
              <TableCell key={header.key}>{row[header.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default SortableTable;
