import React from "react";
import { Drawer, Paper, Button, ListItemText, List, ListItem, Checkbox } from "@mui/material";

const GroupDrawer = ({
    isGroupDrawerOpen,
    columns,
    groupedColumns,
    handleGroupToggle,
    applyGrouping,
    setIsGroupDrawerOpen
}) => {
    return (
        <Drawer anchor="right" open={isGroupDrawerOpen} onClose={() => setIsGroupDrawerOpen(false)}>
            <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                <label style={{ fontSize: "20px" }}>Create Groups</label>
                <List>
                    {columns.filter((col) => col.enableGrouping).map((column) => (
                        <ListItem key={column.accessorKey} onClick={() => handleGroupToggle(column.accessorKey)}>
                            <Checkbox checked={groupedColumns.includes(column.accessorKey)} />
                            <ListItemText primary={column.header} />
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" onClick={applyGrouping}>Apply</Button>
                <Button variant="outlined" onClick={() => setGroupedColumns([])}>Clear Grouping</Button>
            </Paper>
        </Drawer>
    );
};

export default GroupDrawer;
