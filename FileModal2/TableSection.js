import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import TableFile from './Tablefile/TableFile';

const TableSection = ({
  fileModalLoader,
  accessGranted,
  noData,
  noDataError,
  pdata,
  valueSearchText,
  handleSearchText,
  selectedSearchColumn,
  endDateTable
}) => {
  if (fileModalLoader) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <ThreeDots height="80" width="80" color="#4fa94d" visible />
        <p>Please wait, data is loading...</p>
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div className="accessDeniedMessage">
        <p className="titleReport">
          {noData ? (noDataError ? 'No Data Found...' : 'Hmm... something seems to have gone wrong.') : "You don't have access to this data."}
        </p>
      </div>
    );
  }

  return (
    <TableFile
      data={pdata}
      searchTextValue={valueSearchText}
      SearchTextData={handleSearchText}
      searchColumn={selectedSearchColumn}
      endDateTable={endDateTable}
    />
  );
};

export default TableSection;
