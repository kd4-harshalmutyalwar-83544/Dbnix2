import { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import moment from 'moment';
import { toast } from 'react-toastify';
import StateContext from '../../../context/StateContext';

const pageSize = 100;

const useFileModalLogic = () => {
  const {
    fileNameToSend,
    apiBaseUrl,
    setLogoutTimers,
    folderName,
    checkedColumns,
    setCheckedColumns,
  } = useContext(StateContext);

  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('userRole') || '';
  const token = sessionStorage.getItem('token');
  const userDownload = sessionStorage.getItem('userDownload');

  const [pdata, setPdata] = useState([]);
  const [searchPdata, setSearchPdata] = useState([]);
  const [dateFromFile, setDateFromFile] = useState(null);
  const [startDateTable, setStartDate] = useState(null);
  const [endDateTable, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [pageWithDate, setPageWithDate] = useState(false);
  const [columns, setColumns] = useState([]);
  const [columnOPTIONS, setColumnOPTIONS] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownSelectedColumn, setDropdownSelectedColumn] = useState('');
  const [valueSearchText, setValueSearchText] = useState('');
  const [selectedSearchColumn, setSelectedSearchColumn] = useState('');
  const [numRows, setNumRows] = useState(1);
  const [accessGranted, setAccessGranted] = useState(true);
  const [fileModalLoader, setFileModalLoader] = useState(false);
  const [noData, setNoData] = useState(false);
  const [noDataError, setNoDataError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [subMenuAnchorEl2, setSubMenuAnchorEl2] = useState(null);
  const [currentSubMenu, setCurrentSubMenu] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(700000);
  const [maxRowsPerSheet, setMaxRowsPerSheet] = useState(700000);
  const [showConsentForm, setShowConsentForm] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [fileDownloadRequest, setFileDownloadRequest] = useState(null);
  const [downloadFileName, setDownloadFileName] = useState();
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [fullDataToDownloadLoader, setFullDataToDownloadLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const onChangeSlider = (newValue) => {
    if (newValue < 0) {
      setInputValue(1);
    } else {
      setInputValue(newValue);
    }
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
    setCurrentSubMenu('');
  };

  const disableDate = (current) => {
    if (userRole === 'User ') {
      const from = moment(dateFromFile);
      const minDate = from.clone().add(-3, 'days');
      return current.isAfter(from, 'day') || current.isBefore(minDate, 'day');
    } else {
      return current.isAfter(moment(dateFromFile), 'day');
    }
  };

  const handleConsentBoxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleConsentFormClose = () => {
    setShowConsentForm(false);
    setFileDownloadRequest(null);
    setIsChecked(false);
  };

  const handleSubMenuClick = (event, subMenu) => {
    setCurrentSubMenu(subMenu);
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleSubMenuClick2 = (event) => {
    setSubMenuAnchorEl2(event.currentTarget);
  };

  const convertToText = (data) => {
    if (!data || data.length === 0) return '';
    const columns = Object.keys(data[0]);
    const colWidths = columns.map((col) =>
      Math.max(col.length, ...data.map((row) => (row[col] ? row[col].toString().length : 0)))
    );
    const header = columns.map((col, i) => col.padEnd(colWidths[i])).join('\t');
    const separator = colWidths.map((width) => ''.repeat(width)).join('\t');
    const rows = data.map((row) =>
      columns.map((col, i) => (row[col] ? row[col].toString().padEnd(colWidths[i]) : ' '.repeat(colWidths[i]))).join('\t')
    );
    return [header, separator, ...rows].join('\n');
  };

  const convertToTextWithoutHeader = (data) => {
    if (!data || data.length === 0) return '';
    const columns = Object.keys(data[0]);
    const colWidths = columns.map((col) =>
      Math.max(col.length, ...data.map((row) => (row[col] ? row[col].toString().length : 0)))
    );
    const separator = colWidths.map((width) => ''.repeat(width)).join('\t');
    const rows = data.map((row) =>
      columns.map((col, i) => (row[col] ? row[col].toString().padEnd(colWidths[i]) : ' '.repeat(colWidths[i]))).join('\t')
    );
    return [separator, ...rows].join('\n');
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearchTextData = useCallback(
    debounce((page, column, searchText) => {
      handleSearchText(page, column, searchText);
    }, 1000),
    []
  );

  useEffect(() => {
    fetchColumns();
  }, []);

  useEffect(() => {
    fetchContentInFiles(fileNameToSend, page);
    fetchMaxDate();
  }, [
    valueSearchText,
    dropdownSelectedColumn,
    checkedColumns,
    startDateTable,
    endDateTable
  ]);

  const fetchColumns = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}api/ReportModules/GetFieldNamesAccordingToUser?username=${userId}&filename=${fileNameToSend}&foldername=${folderName}`);
      const data = await res.json();
      setColumns(data);
      const formatted = data.map(item => ({ label: item, value: item }));
      setColumnOPTIONS(formatted);
      setCheckedColumns(data);
    } catch (err) {
      console.error("Error fetching columns:", err);
    }
  };

  const fetchContentInFiles = async (file, newPage) => {
    setFileModalLoader(true);
    try {
      const url = `${apiBaseUrl}api/ReportModules/GetDataFromTableByColumnName`;
      const res = await axios.post(url, {
        username: userId,
        filename: file,
        foldername: folderName,
        checkedColumns: checkedColumns.length > 0 ? checkedColumns : ["*"],
        pagesize: pageSize,
        pagenumber: newPage
      }, { withCredentials: true });

      if (res.data === "You don't have access to this data") {
        setAccessGranted(false);
        setFileModalLoader(false);
      } else if (res.data === "No Data Found" || res.data.totalCount === 0) {
        setNoData(true);
        setAccessGranted(false);
        setFileModalLoader(false);
      } else {
        const pro = res.data.data;
        setPdata(pro);
        setSearchPdata(pro);
        setNumRows(res.data.totalCount);
        setAccessGranted(true);
        setPage(newPage);
        setFileModalLoader(false);
      }
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 500) {
        setNoData(true);
        setAccessGranted(false);
        setNoDataError(true);
      }
      console.error("Error fetching content:", err);
      setFileModalLoader(false);
    }
  };

  const handleSearchText = async (newPage, column, text) => {
    setValueSearchText(text);
    setSelectedSearchColumn(column);
    setFileModalLoader(true);
    try {
      const url = `${apiBaseUrl}api/ReportModules/GetDataFromTableAfterFilter`;
      const res = await axios.post(url, {
        username: userId,
        filename: fileNameToSend,
        foldername: folderName,
        checkedColumnName: checkedColumns,
        filterColumnName: column,
        pageSize,
        pageNumber: newPage,
        startDate: startDateTable,
        endDate: endDateTable
      }, { withCredentials: true });

      if (res.data === "You don't have access to this data") {
        setAccessGranted(false);
      } else if (res.data === "No Data Found" || res.data.totalCount === 0) {
        setNoData(true);
        setAccessGranted(false);
      } else {
        setPdata(res.data.data);
        setNumRows(res.data.totalCount);
        setAccessGranted(true);
        setPage(newPage);
      }
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 500) {
        setNoData(true);
        setAccessGranted(false);
        setNoDataError(true);
      }
      console.error("Error searching:", err);
    } finally {
      setFileModalLoader(false);
    }
  };

  const fetchMaxDate = async () => {
    try {
      const res = await axios.get(`${apiBaseUrl}api/ReportModules/maxBusinessDate/${fileNameToSend}/${folderName}`, {
        withCredentials: true
      });
      const maxDate = res.data.substring(0, 10);
      setDateFromFile(maxDate);
      setStartDate(maxDate);
      setEndDate(maxDate);
    } catch (err) {
      console.error("Error fetching max date:", err);
    }
  };

  const logUserDownload = async () => {
    try {
      await axios.post(`${apiBaseUrl}api/UsersLogs/UserAction`, {
        username: userId,
        action: "Download",
        downloadUploadFile: fileNameToSend
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("User log error:", err);
    }
  };

  const sendEmail = async () => {
    try {
      await axios.post(`${apiBaseUrl}api/Email/SendEmail`, {
        to: [userId],
        subject: `${userId} Downloaded ${fileNameToSend} File`,
        body: `
          <html>
            <p>Dear User,</p>
            <p>This is to confirm that ${userId} has downloaded the file ${fileNameToSend} from our system.</p>
            <p>Thank you for using our services.</p>
            <p>Sincerely,</p>
            <p>The ICICIHFC</p>
          </html>`
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("Email send error:", err);
    }
  };

  const consentUpdate = async () => {
    try {
      await axios.post(`${apiBaseUrl}api/UsersLogs/InsertConsentDetails`, {
        Username: userId,
        Folder: folderName,
        file: fileNameToSend,
        type: fileDownloadRequest
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (err) {
      console.error("Consent API error:", err);
    }
  };

  const handleConsentFormSubmit = async () => {
    if (!fileDownloadRequest) return;
    await consentUpdate();
    await performFileDownload(fileDownloadRequest);
    handleConsentFormClose();
  };

  const performFileDownload = async (type) => {
    try {
      logUserDownload();
      sessionStorage.setItem("process", true);
      setFullDataToDownloadLoader(true);
      if (type.startsWith("F")) {
        await getFullFileData(fileNameToSend, type.replace("F", ""));
      } else {
        await downloadCurrentPageData(type.replace("C", ""));
      }
    } catch (err) {
      toast.error("Download failed.", { theme: "colored" });
      console.error("Download error:", err);
    } finally {
      setFullDataToDownloadLoader(false);
      sessionStorage.setItem("process", false);
    }
  };

  const getFullFileData = async (filename, format) => {
    try {
      const source = axios.CancelToken.source();
      setCancelTokenSource(source);
      setLogoutTimers(30);
      const url = valueSearchText !== ''
        ? `${apiBaseUrl}api/ReportModules/GenerateFullFileDataFromTableAfterFilter`
        : `${apiBaseUrl}api/ReportModules/GetAlldataAndGenerateFile`;

      const payload = {
        username: userId,
        filename,
        foldername: folderName,
        checkedColumns: checkedColumns.length > 0 ? checkedColumns : ["*"],
        startDate: startDateTable,
        endDate: endDateTable,
        fileFormat: format,
        maxRowsPerSheet
      };

      if (valueSearchText !== '') {
        payload.searchColumn = selectedSearchColumn;
        payload.searchValue = valueSearchText;
      }

      const res = await axios.post(url, payload, {
        withCredentials: true,
        responseType: 'blob',
        cancelToken: source.token
      });

      if (res.status === 200) {
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${downloadFileName}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download successful", { theme: "colored" });
      }
    } catch (err) {
      console.error("Full file download error:", err);
    } finally {
      setLogoutTimers(5);
      setFullDataToDownloadLoader(false);
    }
  };

  const downloadCurrentPageData = async (format) => {
    if (!pdata || pdata.length === 0) return;
    if (format === 'csv') {
      const csv = Papa.unparse(pdata);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${downloadFileName}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(pdata);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${downloadFileName}.xlsx`);
    } else if (format === 'txt') {
      const text = convertToText(pdata);
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${downloadFileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'htxt') {
      const text = convertToTextWithoutHeader(pdata);
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${downloadFileName}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };


  return {
    userId,
    userRole,
    token,
    userDownload,
    pdata,
    searchPdata,
    columns,
    columnOPTIONS,
    searchTerm,
    dropdownSelectedColumn,
    valueSearchText,
    selectedSearchColumn,
    page,
    pageWithDate,
    numRows,
    accessGranted,
    fileModalLoader,
    noData,
    noDataError,
    anchorEl,
    subMenuAnchorEl,
    subMenuAnchorEl2,
    currentSubMenu,
    isOpen,
    inputValue,
    maxRowsPerSheet,
    showConsentForm,
    isChecked,
    fileDownloadRequest,
    downloadFileName,
    cancelTokenSource,
    fullDataToDownloadLoader,
    isSubmitting,
    startDateTable,
    endDateTable,
    dateFromFile,
    setSearchTerm,
    setDropdownSelectedColumn,
    setCheckedColumns,
    setShowConsentForm,
    setFileDownloadRequest,
    setDownloadFileName,
    setPage,
    setStartDate,
    setEndDate,
    setAnchorEl,
    setSubMenuAnchorEl,
    setSubMenuAnchorEl2,
    setCurrentSubMenu,
    setIsOpen,
    setInputValue,
    setIsChecked,
    setIsSubmitting,
    toggleDropdown,
    onChangeSlider,
    handleClick,
    handleClose,
    disableDate,
    handleSubMenuClick,
    handleSubMenuClick2,
    handleConsentBoxChange,
    handleConsentFormClose,
    debouncedSearchTextData,
    convertToText,
    convertToTextWithoutHeader
  };
};

export default useFileModalLogic;
