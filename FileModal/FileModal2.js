import { Col, InputNumber, Modal, Row, Slider, Select, Input, DatePicker } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import '../styles/TableFile.css'
import axios from 'axios';
// import TableFile from './Tablefile/Tablefile';
import TableFile from './Table';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
// import StateContext from '../../../context/StateContext';
import StateContext from './Statecontext';
import Dropdown from 'rsuite/Dropdown';
import 'rsuite/dist/rsuite.min.css';
import { ThreeDots } from 'react-loader-spinner';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { ToastContainer, toast } from 'react-toastify';
import { IoMdClose } from 'react-icons/io';
import { Select as AntSelect ,FormControl, FormControlLabel, FormGroup,  InputLabel, Menu, MenuItem, Button } from '@mui/material';
// import CheckboxComponent from './CheckboxComponent'
// ;
import CheckboxComponent from './CheckboxComponent'
import { isAfter, startOfDay, subDays } from 'date-fns';
import TextField from '@mui/material/TextField';
import {ArrowDropDownIcon } from '@mui/x-date-pickers';
import moment from 'moment';

const { RangePicker } = DatePicker;

const FileModal2 = (props) => {
    const { modalOpen, setModalOpen } = props;
    const { fileNameToSend, apiBaseUrl, setLogoutTimers, folderName, userSubResult, checkedColumns, setCheckedColumns } = useContext(StateContext);
    const [pdata, setPdata] = useState([{}]);
    const [searchPdata, setSearchPdata] = useState([{}]);
    const [checkedColumnOption, setCheckedColumnOption] = useState([]);
    const [fullDataToDownloadLoader, setFullDataToDownloadLoader] = useState(false);
    const [page, setPage] = useState(1);
    const [pageFilter, setPageFilter] = useState(1);
    const [numRows, setNumRows] = useState(1);
    const [accessGranted, setAccessGranted] = useState(true);
    const [file_Modal_Loader, setFile_Modal_Loader] = useState(false);
    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [noData, setNoData] = useState(false);
    const [noDataError, setNoDataError] = useState(false);
    const [dateFromFile, setDateFromFile] = useState(null);
    const [maxRowsPerSheet, setMaxRowsPerSheet] = useState(700000);
    const userId = sessionStorage.getItem('userId');
    const [cancelTokenSource, setCancelTokenSource] = useState(null);
    const [startDateTable, setStartDate] = useState(null);
    const [endDateTable, setEndDate] = useState(null);
    const [selectedItems, setSelectedItems] = useState();
    const [pageWithDate, setPageWithDate] = useState(false);
    const [OPTIONS, setOPTIONS] = useState([]);
    const [columnOPTIONS, setColumnOPTIONS] = useState([]);
    const [searchTextForFilter, setSearchTextForFilter] = useState('');
    const [dropdownSelectedColumn, setDropdownSelectedColumn] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showConsentForm, setShowConsentForm] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileDownloadRequest, setFileDownloadRequest] = useState(null);
    const [downloadFileName, setDownloadFileName] = useState();
    const [columns, setColumns] = useState([]);
    const [dropdownSelectedColumnsFormCheckBox, setDropdownSelectedColumnsFormCheckBox] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [subMenuAnchorEl2, setSubMenuAnchorEl2] = useState(null);
    const [currentSubMenu, setCurrentSubMenu] = useState('');
    const [inputValue, setInputValue] = useState(700000);
    const [valueSearchText, setValueSearchText] = useState('');
    const [selectedSearchColumn, setSelectedSearchColumn] = useState('');

    const userRole = sessionStorage.getItem("userRole") || "";
    const token = sessionStorage.getItem("token");
    const pageSize = 100;
    let userDownload = sessionStorage.getItem("userDownload");

    const onChange = (newValue) => {
        if (newValue < 0) {
            setInputValue(1);
        } else {
            setInputValue(newValue);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSubMenuAnchorEl(null);
        setCurrentSubMenu('');
    };

    const handleSubMenuClick = (event, subMenu) => {
        setCurrentSubMenu(subMenu);
        setSubMenuAnchorEl(event.currentTarget);
    };
    const handleSubMenuClick2 = (event) => {
        setSubMenuAnchorEl2(event.currentTarget);
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleCheckboxClick = (e) => {
        // e.stopPropagation(); // Prevent event propagation to the Select
    };

    const from = moment(dateFromFile);

    const disableDate = (current) => {
        if (userRole === 'User ') {
            if (from) {
                const minDate = from.clone().add(-3, 'days');
                return (
                    current.isAfter(from, "day") || 
                    current.isBefore(minDate, "day")

                    );
            }
        } else {
            return current.isAfter(from, "day");
        }
        return false;
    };

    const handleDateChange = (dates) => {
        if (dates && dates.length >= 2) {
            
            //Extract the max business date from the API response
        
            const [day, month, year] = dateFromFile.split('/').map(Number);

            // create a Date Object
            const formatted_Date = new Date(year, month - 1, day);
            const maxBusinessDateStr = formatted_Date;
            const maxBusinessDate = new Date(Date.parse(maxBusinessDateStr));

            // Calculate the start date limit (4 days from max business date)
            const startDateLimit = new Date(maxBusinessDate);
            startDateLimit.setDate(startDateLimit.getDate() - 4);

            const endDateLimit = new Date(maxBusinessDate);
            endDateLimit.setDate(endDateLimit.getDate() + 1);

            let sdate = new Date(dates[0]);
            sdate.setDate(sdate.getDate() + 1);

            let edate = new Date(dates[1]);
            edate.setDate(edate.getDate() + 1);

            //Ensure the selected start date is after the limit
            if (userRole === 'User') {
                if (edate > endDateLimit) {
                    toast.error("End Date is Out of Permitted Range...", { theme: "colored" });
                    setPageWithDate(false);
                } else if (sdate < startDateLimit) {
                    toast.error("Start Date is Out of Permitted Range...", { theme: "colored" });
                    setPageWithDate(false);
                } else {
                    setStartDate(sdate.toISOString().split('T')[0]);
                    fetchContentInFilesWithDate(fileNameToSend, page, sdate.toISOString().split('T')[0], edate.toISOString().split('T')[0]);
                }
            } else {
                setStartDate(sdate.toISOString().split('T')[0]);
                fetchContentInFilesWithDate(fileNameToSend, page, sdate.toISOString().split('T')[0], edate.toISOString().split('T')[0]);
            }
            setEndDate(edate ? edate.toISOString().split('T')[0] : '');
        } else {
            setStartDate(null);
            setEndDate(null);
            setPageWithDate(false);
        }
    };

    const fetchContentInFilesWithDate = async (e, newPage, start, end ) => {
        setFile_Modal_Loader(true);

        if(valueSearchText.trim() !== '') {
            handleSearchText(newPage, selectedSearchColumn, valueSearchText)
        } else {
        try {
            const getContentInFilesApiUrl = `${apiBaseUrl}api/ReportModules/getModalDataWithDate`;
            const urlForApi = getContentInFilesApiUrl;

            const filesResponse = await axios.post(urlForApi, 
                {
                username: userId,
                filename: fileNameToSend,
                foldername: folderName,
                checkedColumnName: checkedColumns.length > 0 ? checkedColumns : ["*"],
                pagesize: pageSize,
                pagenumber: newPage,
                startDate: start,
                endDate: end,
            }, { withCredentials: true });

            if (filesResponse.data === "You don't have access to this data") {
                setAccessGranted(false);
                setFile_Modal_Loader(false);
                setPageWithDate(false);
            } else if (filesResponse.data === "No Data Found" || filesResponse.data.totalCount === 0) {
                setNoData(true);
                setAccessGranted(false);
                setFile_Modal_Loader(false);
                setPageWithDate(false);
            } else {
                setPageWithDate(true);
                const pro = filesResponse.data.data;
                setPdata(pro);
                setSearchPdata(pro);
                setNumRows(filesResponse.data.totalCount);
                setAccessGranted(true);
                setPage(newPage);
                setFile_Modal_Loader(false);
            }
        } catch (error) {
            setPageWithDate(false);
            if (error.response.status === 404 || error.response.status === 500 ) {
                setNoData(true);
                setAccessGranted(false);
                setNoDataError(true);
            }
            console.error("Error fetching files in the folders", error);
            setFile_Modal_Loader(false);
        }
    }
};

const fetchContentInFiles = async (e, newPage) => {
    setFile_Modal_Loader(true);

    if(valueSearchText !== '') {
        handleSearchText(newPage, selectedSearchColumn, valueSearchText)
    } else {
        try {
            const getContentInFilesApiUrl = `${apiBaseUrl}api/ReportModules/getmodaldata`;

            const urlForApi = getContentInFilesApiUrl;

            const filesResponse = await axios.post(urlForApi,
                {
                    username: userId,
                    folderName:folderName,
                    fileName:e,
                    columnName: checkedColumns.length > 0 ? checkedColumns : ["*"],
                    pageSize: pageSize,
                pageNo: newPage              
              },
              {
                withCredentials : true,
              }
            );

            if (filesResponse.data === "You dont have access to this data") {
                setAccessGranted(false);
                setFile_Modal_Loader(false);
            }
            else if (filesResponse.data === "No Data Found" || filesResponse.data.totalCount === 0) {
                setNoData(true);
                setAccessGranted(false);
                setFile_Modal_Loader(false);
            } else {
                let pro = filesResponse.data.data;
                setPdata(pro);
                const convertedArray = Object.keys(pro[0]).map(item => ({
                    value: item,
                    label: item,
                }));
                setOPTIONS(convertedArray)
                setColumnOPTIONS(convertedArray)
                setSearchPdata(pro);
                setNumRows(filesResponse.data.totalCount);
                setAccessGranted(true);
                setPage(newPage);
                setFile_Modal_Loader(false);
            }
            } catch (error) {
                if (error.response.status === 404 || error.response.status === 500) {
                    setNoData(true);
                    setAccessGranted(false);
                    setNoDataError(true);
                }

                console.error("Error fetching files in the folder:", error);
                setFile_Modal_Loader(false);
            }
        }
    };



    useEffect(() => {
        fetchColumns();
    }, []);

    useEffect(() => {
        fetchContentInFiles(fileNameToSend, page);
        fetchMaxDate();
    }, [searchTextForFilter, setValueSearchText, setSearchTextForFilter, setSelectedSearchColumn, setInputValue, checkedColumns ]);

    const handleChange = (event, value) => {
        if (checkedColumns.length > 0) {
            fetchByColumnName(fileNameToSend, value);
        } else if (pageWithDate === false) {
            fetchContentInFiles(fileNameToSend, value);
        } else {
            fetchContentInFilesWithDate(fileNameToSend, value, startDateTable, endDateTable);
        }
    };

    const getFullFileData = async (filename, fileTypes) => {
        const source = axios.CancelToken.source();
        setCancelTokenSource(source);
        setFullDataToDownloadLoader(true);
        setLogoutTimers(30);
        sessionStorage.setItem("process", true);
        var getFullData = `${apiBaseUrl}api/ReportModules/`;

        try {
            if (valueSearchText !== '') {
                getFullData += 'GenerateFullFileDataFromTableAfterFilter';
                const filesResponse = await axios.post(getFullData, {
                    username: userId,
                    filename: filename,
                    foldername: folderName,
                    checkedColumns: checkedColumns.length > 0 ? checkedColumns : ["*"],
                    searchColumn: selectedSearchColumn,
                    searchValue: valueSearchText,
                    startDate: startDateTable,
                    endDate: endDateTable,
                    fileFormat: fileTypes,
                    maxRowsPerSheet: maxRowsPerSheet,
                }, {
                    withCredentials: true,
                    responseType: 'blob',
                    cancelToken: source.token,
                });

                if (filesResponse.status === 200) {
                    const blob = new Blob([filesResponse.data], { type: filesResponse.headers['content-type'] });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${downloadFileName}.zip`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setLogoutTimers(5);
                    setFullDataToDownloadLoader(false);
                    toast.success("Download successfully...", { theme: "colored" });
                } else {
                    setFullDataToDownloadLoader(false);
                    setLogoutTimers(5);
                    toast.error("Something went wrong...", { theme: "colored" });
                }
            } else {
                const fullData = getFullData + `GetAlldataAndGenerateFile`;
                const filesResponse = await axios.post(fullData, {
                    "checkedColumns": checkedColumns.length > 0 ? checkedColumns : ["*"],
                    "endDate": endDateTable,
                    "fileFormat": fileTypes,
                    "filename": filename,
                    "foldername": folderName,
                    "maxRowsPerSheet": maxRowsPerSheet,
                    "startDate": startDateTable,
                    "username": userId,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                    responseType: 'blob',
                    cancelToken: source.token,
                });

                if (filesResponse.status === 200) {    
                    const blob = new Blob([filesResponse.data], { type: filesResponse.headers['content-type'] });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${downloadFileName}.zip`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setLogoutTimers(5);
                    setFullDataToDownloadLoader(false);
                    toast.success("Download successfully...", { theme: "colored" });
                } else {
                    setFullDataToDownloadLoader(false);
                    setLogoutTimers(5);
                    toast.error("Something went wrong...", { theme: "colored" });
                }
            }
        } catch (error) {
            console.error("error=:", error);
            if (axios.isCancel(error)) {
                setLogoutTimers(5);
                setFullDataToDownloadLoader(false);
            } else {
                console.error("Error fetching files in the folder:", error);
                toast.error("Something went wrong...", { theme: "colored" });
                setLogoutTimers(5);
                setFullDataToDownloadLoader(false);
            }
            setLogoutTimers(5);
            setFullDataToDownloadLoader(false);
        } finally {
            sessionStorage.setItem("process", false);
        }
    };

    const cleanupAfterCancel = () => {
        setCancelTokenSource(null);
        setFullDataToDownloadLoader(false);
    };

    const cancelDownload = () => {
        if (cancelTokenSource) {
            //API call
            cancelTokenSource.cancel('Download canceled');
            sessionStorage.setItem("process", false);
            //cleanup After canceling
            cleanupAfterCancel();
        }
    };

    const handleConsentBoxChange = (e) => {
        setIsChecked(e.target.checked);
    }

    const handleConsentFormClose = () => {
        setShowConsentForm(false);
        setFileDownloadRequest(null);
        setIsChecked(false);
    };

    const consentUpdate = async () => {
        const consentDetails = {
            "Username": userId,
            "Folder": folderName,
            "file": fileNameToSend,
            "type": fileDownloadRequest,
        }

        try {
            const apiToFetch = `${apiBaseUrl}api/UsersLogs/InsertConsentDetails`;
            const response = await axios.post(apiToFetch, consentDetails, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 200) {
                console.error("API ERROR", response);
            }
        } catch (error) {
            console.error("The API error is", error);
        }
    };

    const handleConsentFormSubmit = async () => {
        if (fileDownloadRequest) {
             consentUpdate();
            await performFileDownload(fileDownloadRequest);
            handleConsentFormClose();
        }
    };

    const handleFileDownload = (type) => {
        handleClose();
        setFileDownloadRequest(type);
        setShowConsentForm(true);
        if (startDateTable !== null && endDateTable !== null) {
            setDownloadFileName(fileNameToSend + '(' + startDateTable.toString() + '_' + endDateTable.toString() + ')');
        } else {
            setDownloadFileName(fileNameToSend + '(' + dateFromFile.toString() + ')' );
        }
    };
//  Now here
    const performFileDownload = async (e) => {
        // sendMail()
        userLogs();
        sessionStorage.setItem("process", true);
        setFullDataToDownloadLoader(true);

        try {
            if (e.startsWith('F')) 
                {
            //full file download
                if (e === 'Fxlsx') {
                    await getFullFileData(fileNameToSend, 'xlsx');
                } else if (e === 'Fcsv') {
                    await getFullFileData(fileNameToSend, 'csv');
                } else if (e === 'Fhtxt') {
                    await getFullFileData(fileNameToSend, 'htxt');
                } else if (e === 'Ftxt') {
                    await getFullFileData(fileNameToSend, 'txt'); 
            }
        }
                    else {
                        //current page download
                        if (e === 'Cxlsx') {
                        const ws = XLSX.utils.json_to_sheet(pdata);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                        XLSX.writeFile(wb, `${downloadFileName}.xlsx`);
                    } else if (e === 'Ccsv') {
                        const csv = Papa.unparse(pdata);
                        const blob = new Blob([csv], {type: 'text/csv'});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${downloadFileName}.csv`;
                        a.click();
                        URL.revokeObjectURL(url);
                    } else if (e === 'Chtxt') {
                        const tabSeparatedContent = convertToText(pdata);
                        const blob = new Blob([tabSeparatedContent], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${downloadFileName}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                } else if  (e === 'Ctxt') {
                    const tabSeparatedContent = convertToTextWithoutHeader(pdata);
                    const blob = new Blob([tabSeparatedContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${downloadFileName}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            }
        // }   catch (error) {
        //     console.error("Error:", error);
        // } finally {
        //     setFullDataToDownloadLoader(false);
        //     setIsChecked(false);
        //     sessionStorage.setItem("process", false);
        // }
        } catch (error) {
            console.error("Error during file download:", error);
            toast.error("Something went wrong during the download...", { theme: "colored" });
        } finally {
            setFullDataToDownloadLoader(false);
            sessionStorage.setItem("process", false);
        }
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
}


    // Function to convert data to text format without header
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
}

// Function to send email notification after download
const sendEmail = async () => {
    const mailDataToSend = {
        "to": [userId],
        "subject": `${userId} Downloaded ${fileNameToSend} File`,
        "body": `<html>
                    <p>Dear User,</p>
                    <p>This is to confirm that ${userId} has downloaded the file ${fileNameToSend} from our system.</p>
                    <p>Thank you for using our services.</p>
                    <p>Sincerely,</p>
                    <p>The ICICIHFC</p>
                  </html>`
    };

    try {
        const apiToFetch = `${apiBaseUrl}api/Email/SendEmail`;
        const response = await axios.post(apiToFetch, mailDataToSend, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            // Email sent successfully
        } else {
            console.error("API ERROR", response)
        }
    } catch (error) {
        console.error("The API Error is", error);
    }
};

// Function to log user activity
const userLogs = async () => {
    const mailDataToSend = {
        "username": userId,
        "action": "Download",
        "downloadUploadFile": fileNameToSend
    };

    try {
        const apiToFetch = `${apiBaseUrl}api/UsersLogs/UserAction`;
        const response = await axios.post(apiToFetch, mailDataToSend, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
        } else {
            console.error("API ERROR", response);
        }
    } catch (error) {
        console.error("The API error", error);
    }
};

// Function to handle sorting of rows
const handleSort = (numRows) => {
    setNumRows(numRows);
};

// Debounce utility function
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

// Debounced version of search text data
const debouncedSearchTextData = useCallback(debounce((page, column, searchText) => {
    handleSearchText(page, column, searchText);
}, 1000), []);

// Handle search text change
const handleAllTextSearch = (e) => {
    const searchValueText = e.target.value;
    console.log("search text", searchValueText)
    setSearchTextForFilter(searchValueText);
    if (searchValueText === '') {
        debouncedSearchTextData(1, dropdownSelectedColumn, ''); // Call debounced function
    } else {
        debouncedSearchTextData(1, dropdownSelectedColumn, searchValueText);
    }
};

// Function to handle search text
const handleSearchText = async (newPage, column, searchText) => {
    setValueSearchText(searchText);
    setSelectedSearchColumn(column);
    setFile_Modal_Loader(true);

    try {

        const urlForApi = `${apiBaseUrl}api/ReportModules/GetDataFromTableAfterFilter`;

        const filesResponse = await axios.post(urlForApi, {
            username: userId,
            filename: fileNameToSend,
            foldername: folderName,
            checkedColumnName: checkedColumns.length > 0 ? checkedColumns : ["*"],
            filterColumnName: column,
            pageSize: pageSize,
            pageNumber: newPage,
            startDate: startDateTable,
            endDate: endDateTable,
        }, { withCredentials: true });

        if (filesResponse.data === "You don't have access to this data") {
            setAccessGranted(false);
            setFile_Modal_Loader(false);
        } else if (filesResponse.data === "No Data Found" || filesResponse.data.totalCount === 0) {
            setNoData(true);
            setAccessGranted(false);
            setFile_Modal_Loader(false);
        } else {
            const pro = filesResponse.data.data;
            setPdata(pro);
            setNumRows(filesResponse.data.totalCount);
            setAccessGranted(true);
            setPage(newPage);
            setFile_Modal_Loader(false);
        }
    } catch (error) {
        if (error.response && (error.response.status === 404 || error.response.status === 500)) {
            setNoData(true);
            setAccessGranted(false);
            setNoDataError(true);
        }
        console.error("Error fetching filter data:", error);
        setFile_Modal_Loader(false);
    }
};

// Function to handle dropdown change
const handleChangeDropdown = (value, label) => {
    setSelectedItems('');
    setSelectedItems(label);
    setDropdownSelectedColumn(label.value);
};

// Fetch max business date
const fetchMaxDate = async () => {
    try {
        const sortedDataResponse = await axios.get(`${apiBaseUrl}api/ReportModules/maxBusinessDate/${fileNameToSend}/${folderName}`, { withCredentials: true });
        setDateFromFile(sortedDataResponse.data.substring(0, 10));
        setStartDate(sortedDataResponse.data.substring(0, 10));
        setEndDate(sortedDataResponse.data.substring(0, 10));
    } catch (error) {
        console.error("Error fetching sorted data:", error);
    }
};


  let filterOption = (input, option) => 
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  let filterOptions = (input, option) => 
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  
// Fetch all access column names
const fetchColumns = async () => {
    try {
        const response = await fetch(`${apiBaseUrl}api/ReportModules/GetFieldNamesAccordingToUser?username=${userId}&filename=${fileNameToSend}&foldername=${folderName}`
        );
        const data = await response.json();
        setColumns(data);
        const convertedArray = data.map(item => ({ value: item, label: item }));
        setColumnOPTIONS(convertedArray);
        setCheckedColumns(data);
    } catch (error) {
        console.error('Error fetching column names:', error);
    }
};

// Function to handle checkbox change
const handleCheckboxChange = (event) => {
    
    const { value, checked } = event.target;
    console.log("val");

    if (value === 'selectAll') {
        if (checked) {
            setCheckedColumns(columns);
        } else {
            setCheckedColumns([]);
        }
    } else {
        if (checked) {
            setCheckedColumns(prevState => [...prevState, value]);
        } else {
            setCheckedColumns(prevState => prevState.filter(column => column !== value));
        }
    }
};

// Filter columns based on search terms
const filteredColumns = searchTerm ? columns.filter(column => column.toLowerCase().includes(searchTerm.toLowerCase())) : columns;

// Function to fetch data by column name
const fetchByColumnName = async ( 
e, newPage) => {
    setFile_Modal_Loader(true);
    if (valueSearchText.trim() !== '') {
        handleSearchText(newPage, selectedSearchColumn, valueSearchText);
    } else {
        try {
            const getContentInFilesApiUrl = `${apiBaseUrl}api/ReportModules/GetDataFromTableByColumnName`;

            const urlForApi = getContentInFilesApiUrl

            const filesResponse = await axios.post( urlForApi, {
                username: userId,
                filename: e,
                foldername: folderName,
                checkedColumns: checkedColumns,
                pagesize: pageSize,
                pagenumber: newPage,
            }, { withCredentials: true });

            if (filesResponse.data === "You don't have access to this data") {
                setAccessGranted(false);
                setFile_Modal_Loader(false);
            } else if (filesResponse.data === "No Data Found" || filesResponse.data.totalCount === 0) {
                setNoData(true);
                setAccessGranted(false);
                setFile_Modal_Loader(false);
            } else {
                const pro = filesResponse.data.data;
                setPdata(pro);
                setSearchPdata(pro);
                setNumRows(filesResponse.data.totalCount);
                setAccessGranted(true);
                setPage(newPage);
                setFile_Modal_Loader(false);
            }
        } catch (error) {
            if  (error.response.status === 404 || error.response.status === 500) {
                setNoData(true);
                setAccessGranted(false);
                setNoDataError(true);
            }
            console.error("Error fetching files in the folder:", error);
            setFile_Modal_Loader(false);
        }
    }
};

return (
<>
 
< Modal centered
  open={modalOpen}
  footer={null}
  title={null}
  width={"1200px"}
  closeIcon={fullDataToDownloadLoader? false: true}
  maskClosable={false}
  onCancel={() => { setModalOpen(false); }}
  >

<ToastContainer />

{/* starting from here */}

<div className="modalContent">
 <div className= 'modalContentsModule'>
<div style={{ display: "flex", paddingBottom: "20px" }}>
<div
  style={{
    display: "flex",
    JustifyContent: "left",
    alignItems: "center",
    marginBottom: "4px",
    width: "1150px",
    marginLeft: "11px",
  }}> I
{/* check */}

<div className="modalViewComponent">
  <FormControl sx={{minwidth: 200 }} size="small">
  <InputLabel style={{ height: "32px", paddingRight: "10px", paddingBottom: '10px',
   fontSize: "12px"}}>{fileNameToSend}</InputLabel>
  <AntSelect
    label={fileNameToSend}
    open={isOpen}
    onOpen={handleToggle}
    onClose={handleToggle}
    MenuProps={{
      PaperProps: {
       style: {
          width: 200,
       },
    },
}}
 style={{height: 32 }}
 >

<TextField
  placeholder = 'Select Column Name'
  fullwidth
  InputProps={{
    style: {
        height: 25,
},
  }}
onClick={(e) => e.stopPropagation()}
onChange={(e) => setSearchTerm(e.target.value)}
value={searchTerm}
/> 
<MenuItem className="fileModalCheckbox" onClick={(e) => e.stopPropagation()}>
  <div onClick={(e)=> e.stopPropagation()}>
    <CheckboxComponent
    columns={filteredColumns}
    checkedColumns ={checkedColumns}
    handleCheckboxChange={handleCheckboxChange}
    onClick={handleCheckboxClick}
    />
</div>
</MenuItem>
</AntSelect>
</FormControl>

<FormControl sx={{minwidth: 150, height: 32}} size="small">
  <Select
    style={{
     width: 150,
     height: 32,
    fontSize: "12px",
    borderRadius: "0.4rem",
    borderBottomRightRadius: "0rem",
    borderTopRightRadius: "0rem",
    }}
    mode='single'
    showSearch
    placeholder="Click to Select Column"
    onChange={handleChangeDropdown}
    filterOption={filterOption}
    options={columnOPTIONS}
/>
</FormControl>

{/* search bar when data is shown in home/folder/file */}

<FormControl sx={{minWidth: 150, height: 32}} size="small">
 <Input
   width={150}
   height={32}
   sx={{
    borderRadius: "0.4rem",
   }}
   placeholder= "Enter text to search"
   //value (searchTextForFilter)
   onChange={handleAllTextSearch}
   />

</FormControl>
   <FormControl sx={{minWidth: 150, height: 32}} size="small">
     <RangePicker
      classhame="bg-transparent"
      onChange={handleDateChange}
      disabledDate={(current) => disableDate(current)}
    />
</FormControl>
</div>
<div>
   <p className="titleReport_date">
      Refresh on: {dateFromFile}
</p>
<p className="titleReport_date">Count: {numRows}</p>
</div>
</div>
</div>
<div className="headerContent">
</div>
{file_Modal_Loader ?
<div style={{ display: "flex", justifyContent: "center", alignSelf: "center",
flexDirection: "column", gap: "1%" }}>
<ThreeDots
  height="200"
  width="150"
  radius="9"
  color = '#4fa94d'
  ariaLabel= "three-dots-loading"
  wrapperClassName=""
  visible= {true}
  />

  <p style={{alignSelf: 'center'}}>PLease Wait, Data id loading...</p>


{/* Ending Here */}

</div> : <div className = 'tableContent'> 
    {accessGranted ? ( 
        <TableFile data={pdata} searchTextValue={valueSearchText} SearchTextData = 
        {handleSearchText} 
        searchColumn={selectedSearchColumn}
        endDateTable={endDateTable} />
    ) : (

<div className='accessDeniedMessage'>
  {noData === true ? <p className='titleReport' >{ noDataError ? `NO Data Found...`:
   `Hmm...something seems to have gone wrong.`}</p> :
      <p className= 'titleReport'> You don't have access to this data. </p>
}
</div>
    )}
    </div>}

<div className="paginationNbutton">
  <div style={{ display: "flex", gap: "1vw", width: "70%"}}>
  {numRows > 0 && (
     <div className="paginationNbuttonModal">
      <div style={{ display: "flex", gap: "1vw", width: "100%" }}>
        <div style={{display: "flex", alignItems: "center" }}>
          <div style={{marginLeft: "1vw" }}> Rows per Page: {pageSize}</div>
     <div>
        <Stack spacing={1}>
        <Pagination count = {Math.ceil(numRows / pageSize)} page={page} onChange=
        {handleChange} />
</Stack>
</div>
</div>
</div>
</div>
  )}
</div>
 {userDownload === '1' && 
 <div className= "btnSec">
{fullDataToDownloadLoader ?
<div style={{width: "100%", }}>
<div style={{display: "flex", gap: "15px"}}>
<p>Downloading..</p>
<Box sx= {{width: '35%', height: "25px", position: "relative", alignSelf:
"center", paddingTop: "5px"}}>
<LinearProgress/>
</Box>
<div style={{ paddingTop: "5px"}}>
<IoMdClose  fill='red' size={15} onClick={cancelDownload} />
</div>
</div>
</div>
:
<>
<Button
id="download-button"
aria-controls={anchorEl ? 'download-menu': undefined}
aria-haspopup="true"
aria-expanded={anchorEl ? 'true': undefined}
onClick={handleClick}
variant="contained"
endIcon={<ArrowDropDownIcon/>}
style={{ color: 'black', backgroundColor: '#e5e5ea' }}
>
Download
</Button>
<Menu
id="download-menu"
anchorEl={anchorEl}
open={Boolean(anchorEl)}
onClose={handleClose}
MenuListProps={{
'aria-labelledby': 'download-button',
}}
>
<MenuItem onClick={(event) => handleSubMenuClick(event, 'currentPage')}>
Current Page Download
</MenuItem>
<Menu
Id="current-page-menu"
anchorEl={subMenuAnchorEl}
open={currentSubMenu === 'currentPage' && Boolean (subMenuAnchorEl)} 
onClose={handleClose}
MenuListProps={{
  'aria-labelledby': 'current-page-menu',
}} 
>
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload 
('Ccsv')}}> CSV</MenuItem> 
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload
('Cxlsx')}}> XLSX</MenuItem>
<MenuItem onClick={handleSubMenuClick2}>TEXT</MenuItem>
<Menu
id="text-menu"
anchorEl={subMenuAnchorEl2}
open={Boolean(subMenuAnchorEl2)}
onClose ={handleClose}
MenuListProps={{
'aria-labelledby': 'text-menu',
}}
>
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload
('Chtxt')}}>With Header</MenuItem>
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload
('Ctxt')}}>Mithout Header</MenuItem>
</Menu>
</Menu>
<MenuItem onClick={(event) => handleSubMenuClick(event, 'fullFile')}>
{searchTextForFilter !== '' ? 'Filter Full Data Download': 'Full File Download' }
</MenuItem>
<Menu
id="full-file-menu"
anchorEl={subMenuAnchorEl}
open={currentSubMenu === 'fullFile' && Boolean (subMenuAnchorEl)}
onClose={handleClose}
MenuListProps={{
'aria-labelledby': 'full-file-menu',
}}
>
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload
('Fcsv')}}>CSV</MenuItem>
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload
('Fxlsx')}}>XLSX</MenuItem>
<MenuItem onClick={handleSubMenuClick2}>TEXT</MenuItem>
<Menu
id="text-menu"
anchorEl={subMenuAnchorEl2}
open={Boolean (subMenuAnchorEl2)}
onClose={handleClose}
MenuListProps={{
'aria-labelledby': 'text-menu',
}}
>
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload
('Ftxt')}}>with Header </MenuItem>
<MenuItem onClick={(event) => {event.preventDefault(); handleFileDownload
('Fhtxt')}}>without Header </MenuItem>
</Menu>
</Menu>
</Menu>
<Modal
centered
open= {showConsentForm}
footer={null}
title={null}
width={"auto"}
closeIcon={!fullDataToDownloadLoader}
maskClosable={false}
onCancel={handleConsentFormClose}
>
<div classNlame='consent-form'>
<h3>Terms and Conditions</h3>
<p style={{ color: 'red' }}>
1. It is the responsibility of the concerned Business Users to validate the downloaded data. <br />
2. The data located in the specified folder is restricted exclusively to the team members associated with given permission. <br />
3. Any data dounloaded from the specified folder will result in a transfer of ownership to the downloading team. <br />
4. Users need to make sure to download within given timelines. <br />
5. Any SR raised for data sets, service timeline is 7 working days.</p>
<div>
<Input
type='checkbox'
id='agree'
checked={isChecked}
onChange={handleConsentBoxChange}
/>&nbsp;
<label htmlFor='agree'> I Agree </label>
</div><br />
{isChecked && fileDownloadRequest.startsWith("F") &&
<div>
Rows Per Sheet:
<Row>
<Col span={12}>
<Slider
min={1}
max={numRows}
onChange={onChange}
value={typeof inputValue ==='number' ? inputValue: 0}
/>
</Col>
<Col span={4}>
<InputNumber
min={1}
max={numRows}
style={{ margin: '0 16px' }}
value={inputValue}
onChange={onChange}
/>
</Col>
</Row>
</div> }
<Button
variant="outlined"
onClick={handleConsentFormSubmit}
disabled={!isChecked || isSubmitting}
style={{width: '75px' }}
>
{isSubmitting ? "Submitting...": "OK"}
</Button>&nbsp;&nbsp;
<Button
variant="outlined"
onClick={handleConsentFormClose}
disabled={isSubmitting}
style={{ width: '75px' }}
>
Close
</Button>
</div>
</Modal>
</>}
</div>
}
</div>
</div>
</div>
</Modal>
</>
)
}

export default FileModal2