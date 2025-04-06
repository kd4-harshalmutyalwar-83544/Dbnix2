import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Input,
  TextField
} from '@mui/material';
import { DatePicker } from 'antd';
import CheckboxComponent from './CheckboxComponent';

const { RangePicker } = DatePicker;

const FileModalHeader = ({
  fileNameToSend,
  columns,
  columnOPTIONS,
  checkedColumns,
  handleCheckboxChange,
  searchTerm,
  setSearchTerm,
  handleDateChange,
  disableDate,
  handleConsentBoxChange,
  dropdownSelectedColumn,
  setDropdownSelectedColumn,
  searchTextForFilter,
  handleSearchText,
  dateFromFile,
  numRows
}) => {
  const filteredColumns = searchTerm
    ? columns.filter((col) => col.toLowerCase().includes(searchTerm.toLowerCase()))
    : columns;

  const handleDropdownChange = (value) => {
    const selected = columnOPTIONS.find((opt) => opt.value === value);
    setDropdownSelectedColumn(selected?.value || '');
  };

  return (
    <div className="modalContentsModule">
      <div style={{ display: 'flex', paddingBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            alignItems: 'center',
            marginBottom: '4px',
            width: '1150px',
            marginLeft: '11px'
          }}
        >
          {/* Checkbox Column Selector */}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>{fileNameToSend}</InputLabel>
            <MuiSelect
              value=""
              open={false}
              style={{ height: 32 }}
              renderValue={() => 'Select Columns'}
            >
              <TextField
                placeholder="Search columns"
                fullWidth
                InputProps={{ style: { height: 25 } }}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <MenuItem>
                <CheckboxComponent
                  columns={filteredColumns}
                  checkedColumns={checkedColumns}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </MenuItem>
            </MuiSelect>
          </FormControl>

          {/* Filter Column Dropdown */}
          <FormControl sx={{ minWidth: 150, height: 32 }} size="small">
            <MuiSelect
              style={{
                width: 150,
                height: 32,
                fontSize: '12px',
                borderRadius: '0.4rem'
              }}
              displayEmpty
              value={dropdownSelectedColumn}
              onChange={(e) => handleDropdownChange(e.target.value)}
            >
              <MenuItem value="" disabled>
                Select Column
              </MenuItem>
              {columnOPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          {/* Search Text Input */}
          <FormControl sx={{ minWidth: 150, height: 32 }} size="small">
            <Input
              placeholder="Enter text to search"
              value={searchTextForFilter}
              onChange={handleSearchText}
              sx={{ height: 32 }}
            />
          </FormControl>

          {/* Date Range Picker */}
          <FormControl sx={{ minWidth: 150, height: 32 }} size="small">
            <RangePicker onChange={handleDateChange} disabledDate={disableDate} />
          </FormControl>
        </div>

        <div>
          <p className="titleReport_date">Refresh on: {dateFromFile}</p>
          <p className="titleReport_date">Count: {numRows}</p>
        </div>
      </div>
    </div>
  );
};

export default FileModalHeader;
