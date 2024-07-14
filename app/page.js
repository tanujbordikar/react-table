"use client";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import {
    useMaterialReactTable,
    MaterialReactTable,
    MRT_ToggleGlobalFilterButton,
} from "material-react-table";
import moment from "moment";
import {
    Select,
    MenuItem,
    Box,
    IconButton,
    Button,
    Drawer,
    Paper,
    Stack,
    useMediaQuery,
    List,
    ListItem,
    ListItemText,
    Checkbox,
    FormControlLabel,
    Switch,
    TextField,
    Slider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import FilterListIcon from "@mui/icons-material/FilterList";
import GroupIcon from "@mui/icons-material/Group";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import SortIcon from "@mui/icons-material/Sort";

const ReactTable = () => {
    const [data, setData] = useState([]);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isGroupDrawerOpen, setIsGroupDrawerOpen] = useState(false);
    const [isColumnDrawerOpen, setIsColumnDrawerOpen] = useState(false);
    const [groupedColumns, setGroupedColumns] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [tempColumnVisibility, setTempColumnVisibility] = useState({});
    const [sorting, setSorting] = useState([]);
    const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
    const [dateFilters, setDateFilters] = useState({
        createdAt: { min: null, max: null },
        updatedAt: { min: null, max: null },
    });
    const [textFilters, setTextFilters] = useState({});
    const [selectFilters, setSelectFilters] = useState({});
    const [rangeFilters, setRangeFilters] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://file.notion.so/f/f/ca71608c-1cc3-4167-857a-24da97c78717/b041832a-ec40-47bb-b112-db9eeb72f678/sample-data.json?id=ce885cf5-d90e-46f3-ab62-c3609475cfb6&table=block&spaceId=ca71608c-1cc3-4167-857a-24da97c78717&expirationTimestamp=1721059200000&signature=_wbxL3CZ2Me_FJuxQ-Cyy1QXatJx0lnA0tMx9ijN4wQ&downloadName=sample-data.json"
                );
                const formattedData = response.data.map((item) => ({
                    ...item,
                    createdAt: moment(item.createdAt).format("YYYY-MM-DD"),
                    updatedAt: moment(item.updatedAt).format("YYYY-MM-DD"),
                }));
                setData(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const isMobile = useMediaQuery("(max-width: 1500px)");

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "ID",
                enableGrouping: false,
                size: 150,
                filterFn: "equals",
                filterVariant: "text",
            },
            {
                accessorKey: "name",
                header: "Name",
                enableGrouping: false,
                size: 150,
                filterFn: "includesString",
                filterVariant: "text",
            },
            {
                accessorKey: "category",
                header: "Category",
                filterVariant: "multi-select",
                enableGrouping: true,
                size: 200,
                filterFn: "arrIncludes",
            },
            {
                accessorKey: "subcategory",
                header: "Sub Category",
                filterVariant: "multi-select",
                enableGrouping: true,
                size: 200,
                filterFn: "arrIncludes",
            },
            {
                accessorKey: "createdAt",
                header: "Created At",
                enableGrouping: false,
                size: 200,
                filterFn: "dateBetween",
                filterVariant: "date",
                Cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YY"),
            },
            {
                accessorKey: "updatedAt",
                header: "Updated At",
                enableGrouping: false,
                size: 200,
                filterFn: "dateBetween",
                filterVariant: "date",
                Cell: ({ cell }) => moment(cell.getValue()).format("DD-MMM-YY"),
            },
            {
                accessorKey: "price",
                header: "Price",
                filterVariant: "range-slider",
                enableGrouping: false,
                size: 150,
                filterFn: "between",
            },
            {
                accessorKey: "sale_price",
                header: "Sale Price",
                filterVariant: "range-slider",
                enableGrouping: false,
                size: 150,
                filterFn: "between",
            },
        ],
        []
    );

    const table = useMaterialReactTable({
        columns,
        data,
        columnFilterDisplayMode: "custom",
        enableGlobalFilter: true,
        enableFacetedValues: true,
        enableGrouping: true,
        enableHiding: true,
        paginationDisplayMode: "pages",
        enableDensityToggle: false,
        initialState: { density: "compact", grouping: groupedColumns },
        state: { columnVisibility, sorting },
        onColumnVisibilityChange: setColumnVisibility,
        muiTableBodyCellProps: { align: "center" },
        muiTableHeadCellProps: { align: "center" },
        onSortingChange: setSorting,
        muiFilterTextFieldProps: ({ column }) => ({
            label: `Filter by ${column.columnDef.header}`,
        }),
        renderToolbarInternalActions: ({ table }) => (
            <Box>
                <MRT_ToggleGlobalFilterButton table={table} />
                <IconButton onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}>
                    <FilterListIcon />
                </IconButton>
                <IconButton onClick={() => setIsGroupDrawerOpen(!isGroupDrawerOpen)}>
                    <GroupIcon />
                </IconButton>
                <IconButton
                    onClick={() => {
                        setTempColumnVisibility(columnVisibility);
                        setIsColumnDrawerOpen(!isColumnDrawerOpen);
                    }}
                >
                    <ViewColumnIcon />
                </IconButton>
                <IconButton onClick={() => setIsSortDrawerOpen(!isSortDrawerOpen)}>
                    <SortIcon />
                </IconButton>
            </Box>
        ),
    });

    const handleGroupToggle = (column) => {
        setGroupedColumns((prev) =>
            prev.includes(column)
                ? prev.filter((col) => col !== column)
                : [...prev, column]
        );
    };

    const applyGrouping = () => {
        table.setGrouping(groupedColumns);
        setIsGroupDrawerOpen(false);
    };

    const applyColumnVisibility = () => {
        setColumnVisibility(tempColumnVisibility);
        setIsColumnDrawerOpen(false);
    };

    const applySorting = () => {
        table.setSorting(sorting);
        setIsSortDrawerOpen(false);
    };

    const applyFilters = () => {
        table.setColumnFilters([
            {
                id: "createdAt",
                value: dateFilters.createdAt.min
                    ? [
                        moment(dateFilters.createdAt.min).format("YYYY-MM-DD"),
                        dateFilters.createdAt.max
                            ? moment(dateFilters.createdAt.max).format("YYYY-MM-DD")
                            : undefined,
                    ]
                    : undefined,
            },
            {
                id: "updatedAt",
                value: dateFilters.updatedAt.min
                    ? [
                        moment(dateFilters.updatedAt.min).format("YYYY-MM-DD"),
                        dateFilters.updatedAt.max
                            ? moment(dateFilters.updatedAt.max).format("YYYY-MM-DD")
                            : undefined,
                    ]
                    : undefined,
            },
            ...Object.keys(textFilters).map((key) => ({
                id: key,
                value: textFilters[key],
            })),
            ...Object.keys(selectFilters).map((key) => ({
                id: key,
                value: selectFilters[key],
            })),
            ...Object.keys(rangeFilters).map((key) => ({
                id: key,
                value: rangeFilters[key],
            })),
        ]);
        setIsFilterDrawerOpen(false);
    };

    const clearFilters = () => {
        setDateFilters({
            createdAt: { min: null, max: null },
            updatedAt: { min: null, max: null },
        });
        setTextFilters({});
        setSelectFilters({});
        setRangeFilters({});
        table.setColumnFilters([]);
    };

    const renderCustomFilter = (header) => {
        const column = header.column.columnDef;

        if (column.filterVariant === "date") {
            return (
                <Box key={header.id} sx={{ mb: 2 }}>
                    <DatePicker
                        label={`Min ${column.header}`}
                        value={dateFilters[column.accessorKey]?.min || null}
                        onChange={(newValue) =>
                            setDateFilters((prev) => ({
                                ...prev,
                                [column.accessorKey]: {
                                    ...prev[column.accessorKey],
                                    min: newValue,
                                },
                            }))
                        }
                        slotProps={{ textField: { variant: "standard" } }}
                    />
                    <DatePicker
                        label={`Max ${column.header}`}
                        value={dateFilters[column.accessorKey]?.max || null}
                        onChange={(newValue) =>
                            setDateFilters((prev) => ({
                                ...prev,
                                [column.accessorKey]: {
                                    ...prev[column.accessorKey],
                                    max: newValue,
                                },
                            }))
                        }
                        slotProps={{ textField: { variant: "standard" } }}
                    />
                </Box>
            );
        } else if (column.filterVariant === "text") {
            return (
                <>
                    <TextField
                        key={header.id}
                        label={header.id}
                        value={textFilters[column.accessorKey] || ""}
                        onChange={(e) =>
                            setTextFilters((prev) => ({
                                ...prev,
                                [column.accessorKey]: e.target.value,
                            }))
                        }
                        variant="standard"
                        fullWidth
                    />
                </>
            );
        } else if (column.filterVariant === "multi-select") {
            return (
                <>
                    <label>{header.id}</label>
                    <Select
                        key={header.id}
                        label={header.id}
                        multiple
                        value={selectFilters[column.accessorKey] || []}
                        onChange={(e) =>
                            setSelectFilters((prev) => ({
                                ...prev,
                                [column.accessorKey]: e.target.value,
                            }))
                        }
                        variant="standard"
                        fullWidth
                    >
                        {Array.from(
                            new Set(data.map((row) => row[column.accessorKey]))
                        ).map((value) => (
                            <MenuItem key={value} value={value}>
                                {value}
                            </MenuItem>
                        ))}
                    </Select>
                </>
            );
        } else if (column.filterVariant === "range-slider") {
            const minValue = Math.min(...data.map((row) => row[column.accessorKey]));
            const maxValue = Math.max(...data.map((row) => row[column.accessorKey]));
            return (
                <Box key={header.id} sx={{ mb: 2 }}>
                    <label>{header.id}</label>
                    <Slider
                        value={rangeFilters[column.accessorKey] || [minValue, maxValue]}
                        onChange={(event, newValue) =>
                            setRangeFilters((prev) => ({
                                ...prev,
                                [column.accessorKey]: newValue,
                            }))
                        }
                        valueLabelDisplay="auto"
                        min={minValue}
                        max={maxValue}
                        marks={[
                            { value: minValue, label: `${minValue}` },
                            { value: maxValue, label: `${maxValue}` },
                        ]}
                    />
                </Box>
            );
        }

        return null;
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <Stack direction={isMobile ? "column-reverse" : "row"} gap="8px">
                <MaterialReactTable table={table} />
                <Drawer
                    anchor="right"
                    open={isFilterDrawerOpen}
                    onClose={() => setIsFilterDrawerOpen(false)}
                >
                    <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                        <Stack gap="8px">
                            {table.getLeafHeaders().map((header) => {
                                if (header.column.getCanFilter()) {
                                    return renderCustomFilter(header);
                                }
                                return null;
                            })}
                            <Button variant="contained" onClick={applyFilters}>
                                Apply Filters
                            </Button>
                            <Button variant="outlined" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </Stack>
                    </Paper>
                </Drawer>
                <Drawer
                    anchor="right"
                    open={isGroupDrawerOpen}
                    onClose={() => setIsGroupDrawerOpen(false)}
                >
                    <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                        <List>
                            {columns
                                .filter((col) => col.enableGrouping)
                                .map((column) => (
                                    <ListItem
                                        key={column.accessorKey}
                                        onClick={() => handleGroupToggle(column.accessorKey)}
                                    >
                                        <Checkbox
                                            checked={groupedColumns.includes(column.accessorKey)}
                                        />
                                        <ListItemText primary={column.header} />
                                    </ListItem>
                                ))}
                        </List>
                        <Button variant="contained" onClick={applyGrouping}>
                            Apply
                        </Button>
                        <Button variant="outlined" onClick={() => setGroupedColumns([])}>
                            Clear Grouping
                        </Button>
                    </Paper>
                </Drawer>
                <Drawer
                    anchor="right"
                    open={isColumnDrawerOpen}
                    onClose={() => setIsColumnDrawerOpen(false)}
                >
                    <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                        <List>
                            {columns.map((column) => (
                                <ListItem key={column.accessorKey}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={
                                                    tempColumnVisibility[column.accessorKey] !== false
                                                }
                                                onChange={() =>
                                                    setTempColumnVisibility((prev) => ({
                                                        ...prev,
                                                        [column.accessorKey]: !prev[column.accessorKey],
                                                    }))
                                                }
                                            />
                                        }
                                        label={column.header}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    setTempColumnVisibility(
                                        Object.fromEntries(
                                            columns.map((column) => [
                                                column.accessorKey,
                                                false,
                                            ])
                                        )
                                    )
                                }
                            >
                                Hide All
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() =>
                                    setTempColumnVisibility(
                                        Object.fromEntries(
                                            columns.map((column) => [
                                                column.accessorKey,
                                                true,
                                            ])
                                        )
                                    )
                                }
                            >
                                Show All
                            </Button>
                            <Button variant="contained" onClick={applyColumnVisibility}>
                                Apply
                            </Button>
                        </Stack>
                    </Paper>
                </Drawer>

                <Drawer
                    anchor="right"
                    open={isSortDrawerOpen}
                    onClose={() => setIsSortDrawerOpen(false)}
                >
                    <Paper style={{ width: 300, padding: "16px", overflowY: "auto" }}>
                        <List>
                            {columns.map((column) => (
                                <ListItem key={column.accessorKey}>
                                    <ListItemText primary={column.header} />
                                    <Select
                                        value={
                                            sorting.find((sort) => sort.id === column.accessorKey)
                                                ?.desc
                                                ? "desc"
                                                : sorting.find((sort) => sort.id === column.accessorKey)
                                                    ? "asc"
                                                    : ""
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setSorting((prev) => {
                                                const existingSort = prev.find(
                                                    (sort) => sort.id === column.accessorKey
                                                );
                                                if (value === "asc") {
                                                    // If currently sorted ascending, clear the sort
                                                    if (existingSort) {
                                                        return prev.filter(
                                                            (sort) => sort.id !== column.accessorKey
                                                        );
                                                    }
                                                    return [
                                                        ...prev,
                                                        { id: column.accessorKey, desc: false },
                                                    ];
                                                } else if (value === "desc") {
                                                    // If currently sorted descending, clear the sort
                                                    if (existingSort && existingSort.desc) {
                                                        return prev.filter(
                                                            (sort) => sort.id !== column.accessorKey
                                                        );
                                                    }
                                                    return [
                                                        ...prev,
                                                        { id: column.accessorKey, desc: true },
                                                    ];
                                                } else {
                                                    // If set to none, remove sorting
                                                    return prev.filter(
                                                        (sort) => sort.id !== column.accessorKey
                                                    );
                                                }
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
                        <Button variant="contained" onClick={applySorting}>
                            Apply Sorting
                        </Button>
                        <Button variant="outlined" onClick={() => setSorting([])}>
                            Clear Sorting
                        </Button>
                    </Paper>
                </Drawer>
            </Stack>
        </LocalizationProvider>
    );
};

export default ReactTable;
