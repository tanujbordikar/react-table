import React from "react";
import { Drawer, Paper, Button, FormControlLabel, List, ListItem, Switch, Stack } from "@mui/material";

const ColumnDrawer = ({
    isColumnDrawerOpen,
    setIsColumnDrawerOpen,
    columns,
    tempColumnVisibility,
    setTempColumnVisibility,
    applyColumnVisibility
}) => {
    return (
        <Drawer anchor="right" open={isColumnDrawerOpen} onClose={() => setIsColumnDrawerOpen(false)}>
            <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                <label style={{ fontSize: "20px" }}>Show/Hide Columns</label>
                <List>
                    {columns.map((column) => (
                        <ListItem key={column.accessorKey}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={tempColumnVisibility[column.accessorKey] !== false}
                                        onChange={() => setTempColumnVisibility((prev) => ({
                                            ...prev,
                                            [column.accessorKey]: !prev[column.accessorKey],
                                        }))}
                                    />
                                }
                                label={column.header}
                            />
                        </ListItem>
                    ))}
                </List>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={() => setTempColumnVisibility(Object.fromEntries(columns.map((column) => [column.accessorKey, false])))}>
                        Hide All
                    </Button>
                    <Button variant="outlined" onClick={() => setTempColumnVisibility(Object.fromEntries(columns.map((column) => [column.accessorKey, true])))}>
                        Show All
                    </Button>
                    <Button variant="contained" onClick={applyColumnVisibility}>Apply</Button>
                </Stack>
            </Paper>
        </Drawer>
    );
};

export default ColumnDrawer;
