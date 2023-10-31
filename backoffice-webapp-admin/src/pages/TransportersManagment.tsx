import "./TransportersManagment.css";

import { Button } from "primereact/button";
import { Calendar, CalendarChangeParams } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

import Sidebar from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { Chapter } from "../interfaces/chapters.interface";
import { Transporter } from "../interfaces/transporters.interface";
import { ChapterService } from "../service/ChapterService";
import { TransporterService } from "../service/TransporterService";
import { incrementDateByDay } from "../utils/dates";

const TransportersManagmentTest = () => {
  const columns = [
    { field: "name", header: "Nom" },
    { field: "lastName", header: "prénom" },
    { field: "assignment", header: "Fonction" },
    { field: "email", header: "email" },
    { field: "phone", header: "Télephone" },
    { field: "companyName", header: "Raison Social" },
    { field: "address", header: "Adresse" },
    { field: "ZIPCode", header: "Code postal" },
    { field: "country", header: "Pays" },
    { field: "chapters", header: "Chapitres" },
  ];
  let emptyTransporter: Transporter = {
    _id: "",
    name: "",
    lastName: "",
    assignment: "",
    email: "",
    phone: "",
    companyName: "",
    SIRETNumber: 0,
    address: "",
    ZIPCode: 0,
    country: "",
    startDate: undefined,
    endDate: undefined,
    password: "",
    isActive: true,
    chapters: [],
  };

  const [transporters, setTransporters] = useState<Transporter[]>([]);
  const [transportersWithChaptersName, setTransportersWithChaptersName] =
    useState<Transporter[]>([]);
  const [transporterDialog, setTransporterDialog] = useState(false);
  const [deleteTransporterDialog, setDeleteTransporterDialog] = useState(false);
  const [deleteTransportersDialog, setDeleteTransportersDialog] =
    useState(false);
  const [transporter, setTransporter] = useState<Transporter>(emptyTransporter);
  const [selectedTransporters, setSelectedTransporters] = useState<Transporter[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast: any = useRef(null);
  const dt: any = useRef(null);
  const transporterService = new TransporterService();
  const chapterService = new ChapterService();
  const [dialogTitle, setDialogTitle] = useState("");
  const [error, setError] = useState(null);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Chapter[]>([]);
  const [selectedColumns, setSelectedColumns] = useState(columns);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startDate, setStartDate] = useState<Date | Date[] | undefined>(
    undefined
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endDate, setEndDate] = useState<Date | Date[] | undefined>(undefined);
  const [dateInterval, setDateInterval] = useState<Date | Date[] | undefined>(
    undefined
  );
  const onColumnToggle = (event: any) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol: any) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
  };
  const columnComponents = selectedColumns.map((col) => {
    return (
      <Column key={col.field} field={col.field} header={col.header} sortable />
    );
  });

  useEffect(() => {
    chapterService
      .getChapters()
      .then((res) => {
        setChapters(res.data.data);
      })
      .catch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoadingTable(true);
    transporterService
      .getTransporters()
      .then((res) => {
        setTransporters(res.data.data);
        setTransportersWithChaptersName(
          getTransportersWithChapterName(res.data.data)
        );
        // setTransporters(res.data.data);
        setIsLoadingTable(false);
      })
      .catch((err) => {
        if (err && err.response) {
          toast.current.show({
            severity: "error",
            summary: "error",
            detail: err.response.data.message,
            life: 3000,
          });
          console.log(err.response.data.message);
          setError(err.response.data.message);
        }
        setIsLoadingTable(false);
        console.log(err);
      });
  }, [chapters]); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setTransporter(emptyTransporter);
    setSubmitted(false);
    setTransporterDialog(true);
    setError(null);
    setDialogTitle("Créer un transporteur");
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTransporterDialog(false);
    setError(null);
    setSelectedChapters([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setDateInterval(undefined);
  };

  const hideDeleteTransporterDialog = () => {
    setDeleteTransporterDialog(false);
  };

  const hideDeleteTransportersDialog = () => {
    setDeleteTransportersDialog(false);
  };

  const getTransportersWithChapterName = (
    transportersData: Transporter[]
  ): Transporter[] => {
    const transportersWithChapterName: Transporter[] = [];

    transportersData.forEach((transporter) => {
      const chaptersName: string[] = [];
      transporter.chapters.forEach((chapter) => {
        const chapterName = chapters.find((chapt) => chapt._id === chapter);
        if (chapterName) {
          chaptersName.push(chapterName.title);
        }
      });
      transportersWithChapterName.push({
        ...transporter,
        chapters: chaptersName,
      });
    });

    return transportersWithChapterName;
  };

  const saveTransporter = () => {
    setSubmitted(true);
    if (transporter.name.trim()) {
      let _transporters: any = [...transporters];
      let _transporter: any = { ...transporter };
      if (transporter._id) {
        //editBlock
        // const { __v, drivers, chapters, ...cleanTransporter } = _transporter;
        const { __v, drivers, ...cleanTransporter } = _transporter;
        // let _dateInterval= []
        // _dateInterval.push(cleanTransporter.startDate)
        // _dateInterval.push(cleanTransporter.endDate)
        // setDateInterval(_dateInterval)
        transporterService
          .updateTransporter(transporter._id, cleanTransporter)
          .then((res) => {
            const index = findIndexById(transporter._id);

            _transporters[index] = res.data.data;
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Transporter Updated",
              life: 3000,
            });

            setTransporters(_transporters);
            setTransportersWithChaptersName(
              getTransportersWithChapterName(_transporters)
            );
            setTransporterDialog(false);
            // setTransporter(emptyTransporter);
          })
          .catch((err) => {
            if (err && err.response) {
              console.log(err.response.data.message);
              setError(err.response.data.message);
              toast.current.show({
                severity: "error",
                summary: "error",
                detail: err.response.data.message,
                life: 3000,
              });
            }
            console.log(err);
          });
      } else {
        transporterService
          .addTransporter(_transporter)
          .then((res) => {
            _transporters.push(res.data.data);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Transporter Created",
              life: 3000,
            });

            setTransporters(_transporters);
            setTransportersWithChaptersName(
              getTransportersWithChapterName(_transporters)
            );
            setTransporterDialog(false);
            setTransporter(emptyTransporter);
            // setSelectedChapters([]);
          })
          .catch((err) => {
            if (err && err.response) {
              console.log(err.response.data.message);
              setError(err.response.data.message);
              toast.current.show({
                severity: "error",
                summary: "error",
                detail: err.response.data.message,
                life: 3000,
              });
            }
            console.log(err);
          });
      }
    }
  };

  const editTransporter = (transporter: Transporter) => {
    // let { password, ..._transporter } = transporter;
    if (transporter && transporter.startDate && transporter.endDate) {
      let _interval = [];
      _interval.push(new Date(transporter.startDate));
      _interval.push(new Date(transporter.endDate));

      setDateInterval(_interval);
    }
    const transporterWithIds = transporters.find(
      (trans) => trans._id === transporter._id
    );
    console.log(
      "🚀 ~ file: TransportersManagment.tsx ~ line 282 ~ editTransporter ~ transporterWithIds",
      transporterWithIds
    );
    let { password, ..._transporterWithIds }:any = transporterWithIds;
    const currentSelectedChapters: Chapter[] = [];
    if (_transporterWithIds) {
      setTransporter(_transporterWithIds);
      _transporterWithIds.chapters.forEach((chapter: any) => {
        const chap = chapters.find((chapt) => chapt._id === chapter);
        if (chap) {
          currentSelectedChapters.push(chap);
        }
      });
    }
    setSelectedChapters(currentSelectedChapters);
    setTransporterDialog(true);
    setDialogTitle("Modifier transporter");
  };

  const confirmDeleteTransporter = (transporter: any) => {
    setTransporter(transporter);
    setDeleteTransporterDialog(true);
  };

  const deleteTransporter = () => {
    transporterService
      .deleteTransporter(transporter._id)
      .then((res) => {
        let _transporters: any = transporters.filter(
          (val: any) => val._id !== transporter._id
        );

        setTransporters(_transporters);
        setTransportersWithChaptersName(
          getTransportersWithChapterName(_transporters)
        );
        setDeleteTransporterDialog(false);
        setTransporter(emptyTransporter);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Transporter Deleted",
          life: 3000,
        });
      })
      .catch((err) => {
        if (err && err.response) {
          console.log(err.response.data.message);
          setError(err.response.data.message);
          toast.current.show({
            severity: "error",
            summary: "error",
            detail: err.response.data.message,
            life: 3000,
          });
        }
        console.log(err);
      });
  };

  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < transporters.length; i++) {
      if (transporters[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteTransportersDialog(true);
  };

  const deleteSelectedTransporters = () => {
    let _transporters = transporters.filter( (trans: Transporter) => {
      let deleted = true;
      selectedTransporters.forEach((selectedTransporter) => {
        if (selectedTransporter._id === trans._id) {
          deleted = false;
        }
      });

      return deleted;
    });

    if (selectedTransporters) {
      selectedTransporters.map((transporter: any) =>
        transporterService.deleteTransporter(transporter._id)
      );
    }
    setTransporters(_transporters);
    setTransportersWithChaptersName(getTransportersWithChapterName(_transporters));
    setDeleteTransportersDialog(false);
    setSelectedTransporters([]);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Transporters Deleted",
      life: 3000,
    });
  };

  const onInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | CalendarChangeParams,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _transporter: any = { ...transporter };
    _transporter[`${name}`] = val;

    setTransporter(_transporter);
  };

  const onChaptersChange = (e: { value: any }) => {
    setSelectedChapters(e.value);
    let _transporter: any = { ...transporter };
    _transporter["chapters"] = e.value;
    setTransporter(_transporter);
  };

  const onChangeDateInterval = (e: any) => {
    let interval = e.value;
    setDateInterval(e.value);
    let _transporter: any = { ...transporter };
    if (interval[0]) {
      setStartDate(interval[0]);
      _transporter["startDate"] = interval[0];
    }
    if (interval[1]) {
      setEndDate(interval[1]);
      _transporter["endDate"] = interval[1];
    }
    if (interval[0] && interval[1]) {
      const now = new Date();
      let _startDate = new Date(interval[0]);
      let _endDate = new Date(interval[1]);
      let incrementedStartDate = incrementDateByDay(_startDate);
      let incrementedEndDate = incrementDateByDay(_endDate);
      if (incrementedStartDate >= now && incrementedEndDate > now) {
        _transporter["isActive"] = true;
      } else {
        _transporter["isActive"] = false;
      }
    }

    setTransporter(_transporter);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedTransporters || !selectedTransporters.length}
        />
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editTransporter(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteTransporter(rowData)}
        />
      </React.Fragment>
    );
  };

  const statusBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Status</span>

        {rowData.isActive === true ? (
          <span className={classNames("customer-badge", "status-qualified")}>
            {"active"}
          </span>
        ) : (
          <span className={classNames("customer-badge", "status-unqualified")}>
            {"inactive"}
          </span>
        )}
      </React.Fragment>
    );
  };

  const startDateBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        {new Date(rowData.startDate).toLocaleDateString("fr")}
      </React.Fragment>
    );
  };
  const endDateBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        {new Date(rowData.endDate).toLocaleDateString("fr")}
      </React.Fragment>
    );
  };
  const header = (
    <div className="table-header">
      <h5 className="m-0">Gestion des transporteurs</h5>
      <MultiSelect
        value={selectedColumns}
        options={columns}
        optionLabel="header"
        onChange={onColumnToggle}
        style={{ width: "20em" }}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e: any) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );
  const transporterDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveTransporter}
      />
    </React.Fragment>
  );
  const deleteTransporterDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteTransporterDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteTransporter}
      />
    </React.Fragment>
  );
  const deleteTransportersDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteTransportersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedTransporters}
      />
    </React.Fragment>
  );

  return (
    <>
      <Sidebar currentActive="TransportersManagment" />
      <TopBar title="gestion des Transporteurs " />
      <br />
      <div className="datatable-crud">
        <Toast ref={toast} />
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <div className="datatable-responsive-demo">
            <DataTable
              loading={isLoadingTable}
              resizableColumns
              scrollable
              style={{ width: "100%" }}
              className="p-datatable-responsive-demo"
              ref={dt}
              value={transportersWithChaptersName}
              selection={selectedTransporters}
              onSelectionChange={(e) => setSelectedTransporters(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} transporters"
              globalFilter={globalFilter}
              header={header}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>

              {columnComponents}
              <Column
                field="startDate"
                header="date de debut"
                body={startDateBodyTemplate}
                sortable
              ></Column>
              <Column
                field="endDate"
                header="date de fin"
                body={endDateBodyTemplate}
                sortable
              ></Column>
              <Column
                field="isActive"
                header="Abonnement"
                body={statusBodyTemplate}
                sortable
              ></Column>

              <Column header="Operations" body={actionBodyTemplate}></Column>
            </DataTable>
          </div>
        </div>
        <Dialog
          visible={transporterDialog}
          style={{ width: "50%" }}
          header={dialogTitle}
          modal
          className="p-fluid"
          footer={transporterDialogFooter}
          onHide={hideDialog}
        >
          <br />
          <div className="formgrid grid">
            <small className="p-error">{error ? error : null}</small>
          </div>
          <br />
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="name">Nom</label>
              <InputText
                id="name"
                value={transporter.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.name,
                })}
              />
              {submitted && !transporter.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>

            <div className="field col">
              <label htmlFor="lastName">Prénom</label>
              <InputText
                id="lastName"
                value={transporter.lastName}
                onChange={(e) => onInputChange(e, "lastName")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.lastName,
                })}
              />
              {submitted && !transporter.lastName && (
                <small className="p-error">Last Name is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="assignment">Fonction</label>
              <InputText
                id="assignment"
                value={transporter.assignment}
                onChange={(e) => onInputChange(e, "assignment")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.assignment,
                })}
              />
              {submitted && !transporter.assignment && (
                <small className="p-error">Assignment is required.</small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={transporter.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.email,
                })}
              />
              {submitted && !transporter.email && (
                <small className="p-error">Email is required.</small>
              )}
            </div>

            <div className="field col">
              <label htmlFor="phone">Tél</label>
              <InputText
                id="phone"
                value={transporter.phone}
                onChange={(e) => onInputChange(e, "phone")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.phone,
                })}
              />
              {submitted && !transporter.phone && (
                <small className="p-error">Phone is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="companyName">Raison Sociale</label>
              <InputText
                id="companyName"
                value={transporter.companyName}
                onChange={(e) => onInputChange(e, "companyName")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.companyName,
                })}
              />
              {submitted && !transporter.companyName && (
                <small className="p-error">companyName is required.</small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="SIRETNumber">Numero SIRET</label>
              <InputNumber
                id="SIRETNumber"
                useGrouping={false}
                value={
                  transporter.SIRETNumber ? transporter.SIRETNumber : undefined
                }
                onValueChange={(e: any) => onInputChange(e, "SIRETNumber")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.SIRETNumber,
                })}
              />
              {submitted && !transporter.SIRETNumber && (
                <small className="p-error">SIRETNumber is required.</small>
              )}
            </div>

            <div className="field col">
              <label htmlFor="address">Adresse</label>
              <InputText
                id="address"
                value={transporter.address}
                onChange={(e) => onInputChange(e, "address")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.address,
                })}
              />
              {submitted && !transporter.phone && (
                <small className="p-error">address is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="ZIPCode">Code Postal</label>
              <InputNumber
                id="ZIPCode"
                useGrouping={false}
                value={transporter.ZIPCode ? transporter.ZIPCode : undefined}
                onValueChange={(e: any) => onInputChange(e, "ZIPCode")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.ZIPCode,
                })}
              />
              {submitted && !transporter.ZIPCode && (
                <small className="p-error">ZIPCode is required.</small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="country">Pays</label>
              <InputText
                id="country"
                value={transporter.country}
                onChange={(e) => onInputChange(e, "country")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.country,
                })}
              />
              {submitted && !transporter.country && (
                <small className="p-error">country is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="password">Mot de passe </label>
              <Password
                id="password"
                feedback={false}
                toggleMask
                value={transporter.password}
                onChange={(e) => onInputChange(e, "password")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !transporter.password,
                })}
              />
              {submitted && !transporter.password && (
                <small className="p-error">password is required.</small>
              )}
            </div>
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <MultiSelect
                value={selectedChapters}
                options={chapters}
                onChange={(e) => onChaptersChange(e)}
                filter
                maxSelectedLabels={10}
                optionLabel="title"
                placeholder="Select  chapters"
              />
            </div>
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="creationDate">Abonnement</label>
              <Calendar
                dateFormat="dd/mm/yy"
                id="dateInterva"
                value={dateInterval}
                onChange={(e) => onChangeDateInterval(e)}
                selectionMode="range"
                readOnlyInput
              />
              {submitted && transporter.startDate === null && (
                <small className="p-error">startDate is required.</small>
              )}
              {submitted && transporter.endDate === null && (
                <small className="p-error">endDate is required.</small>
              )}
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={deleteTransporterDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteTransporterDialogFooter}
          onHide={hideDeleteTransporterDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {transporter && (
              <span>
                Are you sure you want to delete <b>{transporter.name}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteTransportersDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteTransportersDialogFooter}
          onHide={hideDeleteTransportersDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {transporter && (
              <span>
                Are you sure you want to delete the selected transporters?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default TransportersManagmentTest;
