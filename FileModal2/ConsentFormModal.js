import React from 'react';
import { Modal, Row, Col, Slider, InputNumber } from 'antd';
import { Button, Input } from '@mui/material';

const ConsentFormModal = ({
  showConsentForm,
  fullDataToDownloadLoader,
  handleConsentFormClose,
  handleConsentFormSubmit,
  isChecked,
  setIsChecked,
  isSubmitting,
  fileDownloadRequest,
  inputValue,
  onChangeSlider,
  numRows
}) => {
  return (
    <Modal
      centered
      open={showConsentForm}
      footer={null}
      title={null}
      width="auto"
      closeIcon={!fullDataToDownloadLoader}
      maskClosable={false}
      onCancel={handleConsentFormClose}
    >
      <div className="consent-form">
        <h3>Terms and Conditions</h3>
        <p style={{ color: 'red' }}>
          1. It is the responsibility of the concerned Business Users to validate the downloaded data. <br />
          2. The data located in the specified folder is restricted exclusively to the team members associated with given permission. <br />
          3. Any data downloaded from the specified folder will result in a transfer of ownership to the downloading team. <br />
          4. Users need to make sure to download within given timelines. <br />
          5. Any SR raised for data sets, service timeline is 7 working days.
        </p>

        {/* Agreement checkbox */}
        <div>
          <Input
            type="checkbox"
            id="agree"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          &nbsp;<label htmlFor="agree">I Agree</label>
        </div>
        <br />

        {/* Slider only for full download */}
        {isChecked && fileDownloadRequest?.startsWith('F') && (
          <div>
            <p>Rows Per Sheet:</p>
            <Row>
              <Col span={12}>
                <Slider
                  min={1}
                  max={numRows}
                  onChange={onChangeSlider}
                  value={typeof inputValue === 'number' ? inputValue : 0}
                />
              </Col>
              <Col span={4}>
                <InputNumber
                  min={1}
                  max={numRows}
                  style={{ margin: '0 16px' }}
                  value={inputValue}
                  onChange={onChangeSlider}
                />
              </Col>
            </Row>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <Button
            variant="outlined"
            onClick={handleConsentFormSubmit}
            disabled={!isChecked || isSubmitting}
            style={{ width: '75px' }}
          >
            {isSubmitting ? 'Submitting...' : 'OK'}
          </Button>
          &nbsp;&nbsp;
          <Button
            variant="outlined"
            onClick={handleConsentFormClose}
            disabled={isSubmitting}
            style={{ width: '75px' }}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConsentFormModal;
