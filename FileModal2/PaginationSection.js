import React from 'react';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

const PaginationSection = ({ numRows, page, handleChange }) => {
  const pageSize = 100;

  if (numRows <= 0) return null;

  return (
    <div className="paginationNbuttonModal">
      <div style={{ display: 'flex', gap: '1vw', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginLeft: '1vw' }}>Rows per Page: {pageSize}</div>
          <Stack spacing={1}>
            <Pagination count={Math.ceil(numRows / pageSize)} page={page} onChange={handleChange} />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default PaginationSection;
