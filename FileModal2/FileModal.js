import React from 'react';
import { Modal } from 'antd';
import { ToastContainer } from 'react-toastify';
import useFileModalLogic from './useFileModalLogic';
import FileModalHeader from './FileModalHeader';
import TableSection from './TableSection';
import PaginationSection from './PaginationSection';
import DownloadSection from './DownloadSection';
import ConsentFormModal from './ConsentFormModal';
import './styles.css'; // Optional external styles if needed

const FileModal = ({ modalOpen, setModalOpen }) => {
  const logic = useFileModalLogic();

  return (
    <>
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
          <FileModalHeader {...logic} />
          <TableSection {...logic} />
          <PaginationSection {...logic} />
          {logic.userDownload === '1' && <DownloadSection {...logic} />}
        </div>
        {logic.showConsentForm && <ConsentFormModal {...logic} />}
      </Modal>
    </>
  );
};

export default FileModal;
