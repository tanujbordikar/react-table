"use client"
import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import {
    useMaterialReactTable,
    MRT_TableHeadCellFilterContainer,
    MaterialReactTable,
    MRT_ShowHideColumnsButton,
    MRT_ToggleFiltersButton
} from 'material-react-table';
import moment from 'moment';
import { Box, IconButton, Paper, Stack, useMediaQuery } from '@mui/material';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import PrintIcon from '@mui/icons-material/Print';

const Example = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://file.notion.so/f/f/ca71608c-1cc3-4167-857a-24da97c78717/b041832a-ec40-47bb-b112-db9eeb72f678/sample-data.json?id=ce885cf5-d90e-46f3-ab62-c3609475cfb6&table=block&spaceId=ca71608c-1cc3-4167-857a-24da97c78717&expirationTimestamp=1720893600000&signature=zsvsXkDgyOdgpgLaKPvryPui8_lyFsezGAO_D0UxGX8&downloadName=sample-data.json');
                const formattedData = response.data.map((item) => ({
                    ...item,
                    createdAt: moment(item.createdAt).format('DD-MMM-YY'),
                    updatedAt: moment(item.updatedAt).format('DD-MMM-YY'),
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    const isMobile = useMediaQuery('(max-width: 1500px)');

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableGrouping: false,
                size: 150,
            },
            {
                accessorKey: 'name',
                header: 'Name',
                enableGrouping: false,
                size: 150,
            },
            {
                accessorKey: 'category',
                header: 'Category',
                filterVariant: 'multi-select',
                size: 200,
            },
            {
                accessorKey: 'subcategory',
                header: 'Sub Category',
                filterVariant: 'multi-select',
                size: 200,
            },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                // accessorFn: (originalRow) => new Date(originalRow.createdAt),
                // filterVariant: 'date-range',
                // Cell: ({ cell }) => cell.getValue().toLocaleDateString(),
                enableGrouping: false,
                size: 200,
            },
            {
                accessorKey: 'updatedAt',
                header: 'Updated At',
                enableGrouping: false,
                size: 200,
            },
            {
                accessorKey: 'price',
                header: 'Price',
                filterVariant: 'range-slider',
                enableGrouping: false,
                size: 150,
            },
            {
                accessorKey: 'sale_price',
                header: 'Sale Price',
                filterVariant: 'range-slider',
                enableGrouping: false,
                size: 150,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data,
        columnFilterDisplayMode: 'custom',
        enableFacetedValues: true,
        enableGrouping: true,
        // enableColumnFilterModes: true,
        paginationDisplayMode: "pages",
        enableDensityToggle: false,
        initialState: {
            density: "compact"
        },
        muiTableBodyCellProps: {
            align: "center"
        },
        muiTableHeadCellProps: {
            align: "center"
        },
        muiFilterTextFieldProps: ({ column }) => ({
            label: `Filter by ${column.columnDef.header}`,
        }),
        renderToolbarInternalActions: ({ table }) => (
            <Box>
                <IconButton
                    onClick={() => {
                        window.print();
                    }}
                >
                    <PrintIcon />
                </IconButton>
                <MRT_ToggleFiltersButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
            </Box>
        ),
    });

    return (
        <Stack direction={isMobile ? 'column-reverse' : 'row'} gap="8px">
            <MaterialReactTable table={table} />
            <Paper>
                <Stack p="8px" gap="8px">
                    {table.getLeafHeaders().map((header) => (
                        <MRT_TableHeadCellFilterContainer
                            enableGrouping
                            key={header.id}
                            header={header}
                            table={table}
                            in
                        />
                    ))}
                </Stack>
            </Paper>
        </Stack>
    );
};

export default Example;
