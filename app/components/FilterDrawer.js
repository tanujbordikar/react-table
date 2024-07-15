import React from "react";
import { Drawer, Paper, Stack, Button } from "@mui/material";

const FilterDrawer = ({
    table,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    renderCustomFilter,
    applyFilters,
    clearFilters,
}) => {
    return (
        <Drawer anchor="right" open={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)}>
            <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                <label style={{ fontSize: "20px" }}>Filters</label>
                <Stack gap="8px">
                    {table.getLeafHeaders().map((header) => header.column.getCanFilter() && renderCustomFilter(header))}
                    <Button variant="contained" onClick={applyFilters}>
                        Apply Filters
                    </Button>
                    <Button variant="outlined" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                </Stack>
            </Paper>
        </Drawer>
    );
};

export default FilterDrawer;
