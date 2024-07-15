import React from "react";
import { Drawer, Paper, Button, ListItemText, List, ListItem, Select, MenuItem } from "@mui/material";

const SortDrawer = ({
    isSortDrawerOpen,
    columns,
    sorting,
    setSorting,
    applySorting,
    setIsSortDrawerOpen
}) => {

    return (
        <Drawer anchor="right" open={isSortDrawerOpen} onClose={() => setIsSortDrawerOpen(false)}>
            <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                <label style={{ fontSize: "20px" }}>Sorting Options</label>
                <List>
                    {columns.map((column) => (
                        <ListItem key={column.accessorKey}>
                            <ListItemText primary={column.header} />
                            <Select
                                value={
                                    sorting.find((sort) => sort.id === column.accessorKey)?.desc ? "desc" :
                                        sorting.find((sort) => sort.id === column.accessorKey) ? "asc" : ""
                                }
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSorting((prev) => {
                                        const existingSort = prev.find((sort) => sort.id === column.accessorKey);
                                        if (value === "asc") {
                                            return existingSort ? prev.filter((sort) => sort.id !== column.accessorKey) : [...prev, { id: column.accessorKey, desc: false }];
                                        } else if (value === "desc") {
                                            return existingSort && existingSort.desc ? prev.filter((sort) => sort.id !== column.accessorKey) : [...prev, { id: column.accessorKey, desc: true }];
                                        }
                                        return prev.filter((sort) => sort.id !== column.accessorKey);
                                    });
                                }}
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" onClick={applySorting}>Apply Sorting</Button>
                <Button variant="outlined" onClick={() => setSorting([])}>Clear Sorting</Button>
            </Paper>
        </Drawer>
    );
};

export default SortDrawer;
