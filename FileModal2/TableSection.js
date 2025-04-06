import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Tablefile from './Tablefile/Tablefile';

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignSelf: 'center',
          flexDirection: 'column',
          gap: '1%'
        }}
      >
        <ThreeDots
          height="200"
          width="150"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          visible={true}
        />
        <p style={{ alignSelf: 'center' }}>Please wait, data is loading...</p>
      </div>
    );
  }

  return (
    <div className="tableContent">
      {accessGranted ? (
        <Tablefile
          data={pdata}
          searchTextValue={valueSearchText}
          SearchTextData={handleSearchText}
          searchColumn={selectedSearchColumn}
          endDateTable={endDateTable}
        />
      ) : (
        <div className="accessDeniedMessage">
          {noData ? (
            <p className="titleReport">
              {noDataError ? 'No Data Found...' : 'Hmm... something seems to have gone wrong.'}
            </p>
          ) : (
            <p className="titleReport">You don't have access to this data.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TableSection;
