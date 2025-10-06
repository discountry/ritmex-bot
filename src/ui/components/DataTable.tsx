import { Box, Text } from 'ink';
import React from 'react';

type Align = 'left' | 'right';

export interface TableColumn {
   key: string;
   header: string;
   align?: Align;
   minWidth?: number;
}

export interface DataTableProps<Row extends Record<string, unknown>> {
   columns: TableColumn[];
   rows: Row[];
}

function formatCell(value: unknown): string {
   if (value === null) { return ''; }
   if (typeof value === 'number') {
      if (Number.isInteger(value)) { return value.toString(); }
      return value.toFixed(4).replace(/\.0+$/, '.0');
   }
   return String(value);
}

function pad(text: string, width: number, align: Align): string {
   if (text.length >= width) { return text; }
   const padding = ' '.repeat(width - text.length);
   return align === 'right' ? padding + text : text + padding;
}

export function DataTable<Row extends Record<string, unknown>>({ columns, rows }: DataTableProps<Row>) {
   const widths = columns.map((col) => {
      const headerLength = col.header.length;
      const minWidth = col.minWidth ?? 0;
      const contentLength = rows.reduce((max, row) => {
         const cell = formatCell(row[col.key]);
         return Math.max(max, cell.length);
      }, 0);
      return Math.max(headerLength, contentLength, minWidth);
   });

   return (
      <Box flexDirection='column'>
         <Text>
            {columns.map((col, index) => {
               const width = widths[index] ?? col.header.length;
               return pad(col.header, width, col.align ?? 'left');
            }).join('  ')}
         </Text>
         {rows.map((row, rowIndex) => (
            <Text key={rowIndex}>
               {columns.map((col, index) => {
                  const align = col.align ?? 'left';
                  const cell = formatCell(row[col.key]);
                  const width = widths[index] ?? Math.max(col.header.length, cell.length);
                  return pad(cell, width, align);
               }).join('  ')}
            </Text>
         ))}
      </Box>
   );
}
