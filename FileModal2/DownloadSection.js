import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Box,
  LinearProgress
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IoMdClose } from 'react-icons/io';

const DownloadSection = ({
  fullDataToDownloadLoader,
  anchorEl,
  subMenuAnchorEl,
  subMenuAnchorEl2,
  currentSubMenu,
  handleClick,
  handleClose,
  handleSubMenuClick,
  handleSubMenuClick2,
  cancelDownload,
  handleFileDownload,
  searchTextForFilter
}) => {
  return (
    <div className="btnSec">
      {fullDataToDownloadLoader ? (
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '15px' }}>
            <p>Downloading...</p>
            <Box
              sx={{
                width: '35%',
                height: '25px',
                position: 'relative',
                alignSelf: 'center',
                paddingTop: '5px'
              }}
            >
              <LinearProgress />
            </Box>
            <div style={{ paddingTop: '5px', cursor: 'pointer' }}>
              <IoMdClose fill="red" size={15} onClick={cancelDownload} />
            </div>
          </div>
        </div>
      ) : (
        <>
          <Button
            id="download-button"
            aria-controls={anchorEl ? 'download-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? 'true' : undefined}
            onClick={handleClick}
            variant="contained"
            endIcon={<ArrowDropDownIcon />}
            style={{ color: 'black', backgroundColor: '#e5e5ea' }}
          >
            Download
          </Button>

          <Menu
            id="download-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'download-button' }}
          >
            <MenuItem onClick={(event) => handleSubMenuClick(event, 'currentPage')}>
              Current Page Download
            </MenuItem>

            <Menu
              id="current-page-menu"
              anchorEl={subMenuAnchorEl}
              open={currentSubMenu === 'currentPage' && Boolean(subMenuAnchorEl)}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'current-page-menu' }}
            >
              <MenuItem onClick={() => handleFileDownload('Ccsv')}>CSV</MenuItem>
              <MenuItem onClick={() => handleFileDownload('Cxlsx')}>XLSX</MenuItem>
              <MenuItem onClick={handleSubMenuClick2}>TEXT</MenuItem>
            </Menu>

            <Menu
              id="text-submenu-1"
              anchorEl={subMenuAnchorEl2}
              open={currentSubMenu === 'currentPage' && Boolean(subMenuAnchorEl2)}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'text-submenu-1' }}
            >
              <MenuItem onClick={() => handleFileDownload('Chtxt')}>With Header</MenuItem>
              <MenuItem onClick={() => handleFileDownload('Ctxt')}>Without Header</MenuItem>
            </Menu>

            <MenuItem onClick={(event) => handleSubMenuClick(event, 'fullFile')}>
              {searchTextForFilter !== '' ? 'Filter Full Data Download' : 'Full File Download'}
            </MenuItem>

            <Menu
              id="full-file-menu"
              anchorEl={subMenuAnchorEl}
              open={currentSubMenu === 'fullFile' && Boolean(subMenuAnchorEl)}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'full-file-menu' }}
            >
              <MenuItem onClick={() => handleFileDownload('Fcsv')}>CSV</MenuItem>
              <MenuItem onClick={() => handleFileDownload('Fxlsx')}>XLSX</MenuItem>
              <MenuItem onClick={handleSubMenuClick2}>TEXT</MenuItem>
            </Menu>

            <Menu
              id="text-submenu-2"
              anchorEl={subMenuAnchorEl2}
              open={currentSubMenu === 'fullFile' && Boolean(subMenuAnchorEl2)}
              onClose={handleClose}
              MenuListProps={{ 'aria-labelledby': 'text-submenu-2' }}
            >
              <MenuItem onClick={() => handleFileDownload('Ftxt')}>With Header</MenuItem>
              <MenuItem onClick={() => handleFileDownload('Fhtxt')}>Without Header</MenuItem>
            </Menu>
          </Menu>
        </>
      )}
    </div>
  );
};

export default DownloadSection;
