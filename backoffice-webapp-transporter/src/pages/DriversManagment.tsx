import "./DriversManagment.css";

import { Button } from "primereact/button";
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
import {
  ToggleButton,
  ToggleButtonChangeParams,
} from "primereact/togglebutton";
import Sidebar from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { DriverService } from "../service/DriverService";
import { Driver } from "../interfaces/drivers.interface";
import { Calendar } from "primereact/calendar";
import { AuthService } from "../service/AuthService";

const DriversManagment = () => {
  const columns = [
    { field: "drivingLicenseNumber", header: "N°Permis" },
    { field: "name", header: "Nom" },
    { field: "lastName", header: "prénom" },
    { field: "email", header: "email" },
    { field: "phone", header: "Télephone" },
    { field: "civility", header: "Civilité" },
  ];
  const [selectedColumns, setSelectedColumns] = useState(columns);
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
  const authService = new AuthService();
  const emptyDriver: Driver = {
    _id: "",
    drivingLicenseNumber: 0,
    name: "",
    lastName: "",
    email: "",
    phone: "",
    civility: "",
    birthDate: new Date(),
    creationDate: new Date(),
    password: "",
    isActive: true,
    transporter: authService.getUser()._id,
  };

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [driverDialog, setDriverDialog] = useState(false);
  const [deleteDriverDialog, setDeleteDriverDialog] = useState(false);
  const [deleteDriversDialog, setDeleteDriversDialog] = useState(false);
  const [driver, setDriver] = useState(emptyDriver);
  const [selectedDrivers, setSelectedDrivers] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast: any = useRef(null);
  const dt: any = useRef(null);
  const driverService = new DriverService();
  const [dialogTitle, setDialogTitle] = useState("");
  const [error, setError] = useState(null);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isActiveAccount, setIsActiveAccount] = useState(true);
  useEffect(() => {
    setIsLoadingTable(true);
    driverService
      .getDrivers()
      .then((res: any) => {
        const DATA = res.data.data.map((data: Driver) => {
          return {
            ...data,
            creationDate: new Date(data.creationDate).toUTCString(),
            birthDate: new Date(data.birthDate).toUTCString(),
          };
        });
        setDrivers(DATA);
        setIsLoadingTable(false);
      })
      .catch((err: any) => {
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangeIsActiveAccount = (e: ToggleButtonChangeParams) => {
    setIsActiveAccount(e.value);
    let _driver: any = { ...driver };
    _driver["isActive"] = e.value;
    if (e.value === true) {
      _driver["creationDate"] = new Date();
    }
    setDriver(_driver);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedBirthDate, setSelectedBirthDate] = useState<
    Date | Date[] | undefined | null
  >();
  const onChangeBirthDate = (e: any) => {
    if (e.value) {
      let date = new Date(e.value);
      console.log(date);
      setSelectedBirthDate(e.value);
      let _driver: any = { ...driver };
      _driver["birthDate"] = date;
      setDriver(_driver);
    }
  };
  const openNew = () => {
    setDriver(emptyDriver);
    setSubmitted(false);
    setDriverDialog(true);
    setError(null);
    setDialogTitle("Créer un chauffeur");
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDriverDialog(false);
    setError(null);
  };

  const hideDeleteDriverDialog = () => {
    setDeleteDriverDialog(false);
  };

  const hideDeleteDriversDialog = () => {
    setDeleteDriversDialog(false);
  };

  const saveDriver = () => {
    setSubmitted(true);
    if (driver.name.trim()) {
      let _drivers: any = [...drivers];
      let _driver: any = { ...driver };
      if (driver._id) {
        console.log(driver);
        //editBlock
        // const { __v, drivers, chapters, ...cleanDriver } = _driver;
        const { __v, token, ...cleanDriver } = _driver;

        driverService
          .updateDriver(driver._id, cleanDriver)
          .then((res: any) => {
            const index = findIndexById(driver._id);

            let __driver = {
              ..._driver,
              creationDate: new Date(_driver.creationDate).toISOString(),
              birthDate: new Date(_driver.birthDate).toISOString(),
            };
            _drivers[index] = __driver;
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Driver Updated",
              life: 3000,
            });
            console.log(res);

            setDrivers(_drivers);
            console.log(
              "🚀 ~ file: DriversManagment.tsx ~ line 169 ~ .then ~ _drivers",
              _drivers
            );
            setDriverDialog(false);
            // setDriver(emptyDriver);
          })
          .catch((err: any) => {
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
        // let*
        let __driver = { ..._driver };
        driverService
          .addDriver(__driver)
          .then((res: any) => {
            _drivers.push({
              ...__driver,
              creationDate: new Date(__driver.creationDate),
              birthDate: new Date(__driver.birthDate),
            });
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Driver Created",
              life: 3000,
            });
            console.log(drivers);
            setDrivers(_drivers);
            setDriver(emptyDriver);
            setDriverDialog(false);
          })
          .catch((err: any) => {
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

  const editDriver = (driver: any) => {
    let { password, ..._driver } = driver;
    setDriver({
      ..._driver,
      creationDate: new Date(driver.creationDate),
      birthDate: new Date(driver.birthDate),
    });
    setDriverDialog(true);
    setDialogTitle("Modifier driver");
  };

  const confirmDeleteDriver = (driver: any) => {
    setDriver(driver);
    setDeleteDriverDialog(true);
  };

  const deleteDriver = () => {
    let _drivers: any = drivers.filter((val: any) => val._id !== driver._id);

    driverService
      .deleteDriver(driver._id)
      .then((res: any) => {
        console.log(res);
        setDrivers(_drivers);
        setDeleteDriverDialog(false);
        setDriver(emptyDriver);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Driver Deleted",
          life: 3000,
        });
      })
      .catch((err: any) => {
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
    for (let i = 0; i < drivers.length; i++) {
      if (drivers[i]._id === id) {
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
    setDeleteDriversDialog(true);
  };

  const deleteSelectedDrivers = () => {
    let _drivers = drivers.filter((val: any) => !selectedDrivers.includes(val));

    if (selectedDrivers) {
      selectedDrivers.map((driver: any) =>
        driverService.deleteDriver(driver._id)
      );
    }
    setDrivers(_drivers);
    setDeleteDriversDialog(false);
    setSelectedDrivers(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Drivers Deleted",
      life: 3000,
    });
  };

  const onInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    name: string
  ) => {
    const val = (e.target && e.target.value) || "";
    let _driver: any = { ...driver };
    _driver[`${name}`] = val;

    setDriver(_driver);
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
          disabled={!selectedDrivers || !selectedDrivers.length}
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
          onClick={() => editDriver(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteDriver(rowData)}
        />
        {}
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="m-0">Gestion des chauffeurs</h5>
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
  const driverDialogFooter = (
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
        onClick={saveDriver}
      />
    </React.Fragment>
  );
  const deleteDriverDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteDriverDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteDriver}
      />
    </React.Fragment>
  );
  const deleteDriversDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteDriversDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedDrivers}
      />
    </React.Fragment>
  );
  const statusBodyTemplate = (rowData: any) => {
    console.log(rowData);
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

  const creationDateBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        {new Date(rowData.creationDate).toLocaleDateString("fr")}
      </React.Fragment>
    );
  };
  const birthDateBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        {new Date(rowData.birthDate).toLocaleDateString("fr")}
      </React.Fragment>
    );
  };

  return (
    <>
      <Sidebar currentActive="DriversManagment" />
      <TopBar title="gestion des Chauffeurs " />
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
              value={drivers}
              selection={selectedDrivers}
              onSelectionChange={(e) => setSelectedDrivers(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} drivers"
              globalFilter={globalFilter}
              header={header}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>
              {columnComponents}
              <Column
                field="creationDate"
                header="date de creation"
                body={creationDateBodyTemplate}
                sortable
              ></Column>
              <Column
                field="birthDate"
                header="date de naissance"
                body={birthDateBodyTemplate}
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
          visible={driverDialog}
          style={{ width: "50%" }}
          header={dialogTitle}
          modal
          className="p-fluid"
          footer={driverDialogFooter}
          onHide={hideDialog}
        >
          <br />
          <div className="formgrid grid">
            <small className="p-error">{error ? error : null}</small>
          </div>
          <br />
          <div className="formgrid grid">
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="drivingLicenseNumber">N° Permis</label>
                <InputNumber
                  id="drivingLicenseNumber"
                  useGrouping={false}
                  value={
                    driver.drivingLicenseNumber
                      ? driver.drivingLicenseNumber
                      : undefined
                  }
                  onValueChange={(e: any) =>
                    onInputChange(e, "drivingLicenseNumber")
                  }
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !driver.drivingLicenseNumber,
                  })}
                />
                {submitted && !driver.drivingLicenseNumber && (
                  <small className="p-error">
                    drivingLicenseNumber is required.
                  </small>
                )}
              </div>
            </div>
            <div className="field col">
              <label htmlFor="name">Nom</label>
              <InputText
                id="name"
                value={driver.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !driver.name,
                })}
              />
              {submitted && !driver.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div>

            <div className="field col">
              <label htmlFor="lastName">Prénom</label>
              <InputText
                id="lastName"
                value={driver.lastName}
                onChange={(e) => onInputChange(e, "lastName")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !driver.lastName,
                })}
              />
              {submitted && !driver.lastName && (
                <small className="p-error">Last Name is required.</small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={driver.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !driver.email,
                })}
              />
              {submitted && !driver.email && (
                <small className="p-error">Email is required.</small>
              )}
            </div>

            <div className="field col">
              <label htmlFor="phone">Tél</label>
              <InputText
                id="phone"
                value={driver.phone}
                onChange={(e) => onInputChange(e, "phone")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !driver.phone,
                })}
              />
              {submitted && !driver.phone && (
                <small className="p-error">Phone is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="civility">Civilité</label>
              <InputText
                id="civility"
                value={driver.civility}
                onChange={(e) => onInputChange(e, "civility")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !driver.civility,
                })}
              />
              {submitted && !driver.civility && (
                <small className="p-error">civility is required.</small>
              )}
            </div>
          </div>

          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="isActiveAccount">Etat du Compte </label>
              <ToggleButton
                onLabel="Compte activé"
                offLabel="Compte désactivé"
                checked={driver.isActive}
                onChange={(e) => onChangeIsActiveAccount(e)}
                onIcon="pi pi-check"
                offIcon="pi pi-times"
              />

              {submitted && !driver.creationDate && (
                <small className="p-error">active Account is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="birthDate">Date de Naissance</label>
              <Calendar
                dateFormat="dd/mm/yy"
                id="birthDate"
                required
                value={driver.birthDate}
                onChange={(e) => onChangeBirthDate(e)}
              ></Calendar>

              {submitted && !driver.birthDate && (
                <small className="p-error">birthDate is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="password">Mot de passe </label>
              <Password
                id="password"
                feedback={false}
                toggleMask
                value={driver.password}
                onChange={(e) => onInputChange(e, "password")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !driver.password,
                })}
              />
              {submitted && !driver.password && (
                <small className="p-error">password is required.</small>
              )}
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={deleteDriverDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteDriverDialogFooter}
          onHide={hideDeleteDriverDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {driver && (
              <span>
                Are you sure you want to delete <b>{driver.name}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteDriversDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteDriversDialogFooter}
          onHide={hideDeleteDriversDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {driver && (
              <span>Are you sure you want to delete the selected drivers?</span>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default DriversManagment;
