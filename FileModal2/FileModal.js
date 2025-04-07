import React from 'react';
import { Modal } from 'antd';
import { ToastContainer } from 'react-toastify';
import useFileModalLogic from './useFileModalLogic';
import FileModalHeader from './FileModalHeader';
import TableSection from './TableSection';
import PaginationSection from './PaginationSection';
import DownloadSection from './DownloadSection';
import ConsentFormModal from './ConsentFormModal';
import './FileModal.css';

const FileModal = ({ modalOpen, setModalOpen }) => {
  const logic = useFileModalLogic();

  return (
    <Modal
      centered
      open={modalOpen}
      footer={null}
      title={null}
      width="1200px"
      closeIcon={!logic.fullDataToDownloadLoader}
      maskClosable={false}
      onCancel={() => setModalOpen(false)}
    >
      <ToastContainer />
      <div className="modalContent">
        <div className="modalContentsModule">
          <FileModalHeader {...logic} />
          <div className="headerMeta">
            <p className="titleReport_date">Refresh on: {logic.dateFromFile}</p>
            <p className="titleReport_date">Count: {logic.numRows}</p>
          </div>
        </div>

        <div className="tableContent">
          <TableSection {...logic} />
        </div>

        <div className="paginationNbutton">
          <PaginationSection {...logic} />
          {logic.userDownload === '1' && <DownloadSection {...logic} />}
        </div>
      </div>

      {logic.showConsentForm && <ConsentFormModal {...logic} />}
    </Modal>
  );
};

export default FileModal;
