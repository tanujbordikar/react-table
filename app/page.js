"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import axios from "axios";
import moment from 'moment';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file


const ReactTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

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
        setFilteredData(formattedData); // Initially, set filtered data to the same as fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDateRangeChange = (ranges) => {
    const { selection } = ranges;
    setDateRange(selection);

    const filtered = data.filter(item => {
      const itemCreatedAt = moment(item.createdAt, 'DD-MMM-YY').toDate();
      const itemUpdatedAt = moment(item.updatedAt, 'DD-MMM-YY').toDate();
      return (
        (itemCreatedAt >= selection.startDate && itemCreatedAt <= selection.endDate) ||
        (itemUpdatedAt >= selection.startDate && itemUpdatedAt <= selection.endDate)
      );
    });

    setFilteredData(filtered);
  };

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

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px', color: 'black', marginRight: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', zIndex:'2' }}>
        <DateRangePicker
          ranges={[dateRange]}
          onChange={handleDateRangeChange}
        />
      </div>
      <div style={{ flex: 1 }}>
        <MaterialReactTable
          columnFilterDisplayMode='popover'
          data={filteredData}
          columns={columns}
          enableFacetedValues
          enableGrouping
          enableColumnFilterModes
          paginationDisplayMode="pages"
          enableDensityToggle={false}
          initialState={{ density: 'compact' }}
          muiTableBodyCellProps={{ align: 'center' }}
          muiTableHeadCellProps={{ align: 'center' }}
        />
      </div>
    </div>
  );
};

export default ReactTable;
