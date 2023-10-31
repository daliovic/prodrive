import "./ChaptersManagment.css";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";

import Sidebar from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { ChapterService } from "../service/ChapterService";

const ChaptersManagmentTest = () => {
  const columns = [
    { field: "title", header: "Titre" },
    { field: "category", header: "catégorie" },
    { field: "description", header: "Description" },
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
  let emptyChapter = {
    _id: "",
    title: "",
    category: "",
    description: "",
  };

  const [chapters, setChapters] = useState<any>([]);
  const [chapterDialog, setChapterDialog] = useState(false);
  const [deleteChapterDialog, setDeleteChapterDialog] = useState(false);
  const [deleteChaptersDialog, setDeleteChaptersDialog] = useState(false);
  const [chapter, setChapter] = useState(emptyChapter);
  const [selectedChapters, setSelectedChapters] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast: any = useRef(null);
  const dt: any = useRef(null);
  const chapterService = new ChapterService();
  const [dialogTitle, setDialogTitle] = useState("");
  const [error, setError] = useState(null);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  useEffect(() => {
    setIsLoadingTable(true);
    chapterService
      .getChapters()
      .then((res) => {
        console.log(res.data.data);
        setChapters(res.data.data);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setChapter(emptyChapter);
    setSubmitted(false);
    setChapterDialog(true);
    setError(null);
    setDialogTitle("Créer un chapitre");
  };

  const hideDialog = () => {
    setSubmitted(false);
    setChapterDialog(false);
    setError(null);
  };

  const hideDeleteChapterDialog = () => {
    setDeleteChapterDialog(false);
  };

  const hideDeleteChaptersDialog = () => {
    setDeleteChaptersDialog(false);
  };

  const saveChapter = () => {
    setSubmitted(true);
    if (chapter.title.trim()) {
      let _chapters: any = [...chapters];
      let _chapter: any = { ...chapter };
      if (chapter._id) {
        //editBlock
        console.log("--->", _chapter);
        const { __v, questions, transporters, ...cleanChapter } = _chapter;

        chapterService
          .updateChapter(chapter._id, cleanChapter)
          .then((res) => {
            const index = findIndexById(chapter._id);

            _chapters[index] = _chapter;
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Chapter Updated",
              life: 3000,
            });
            console.log(res);
            setChapters(_chapters);
            setChapterDialog(false);
            setChapter(emptyChapter);
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
        console.log("_chapter",_chapter);
        console.log("_chapters",_chapters);
        chapterService
          .addChapter(_chapter)
          .then((res) => {
            _chapters.push(_chapter);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Chapter Created",
              life: 3000,
            });
            setChapters(_chapters);
            setChapterDialog(false);
            setChapter(emptyChapter);
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

  const editChapter = (chapter: any) => {
    setChapter({ ...chapter });
    setChapterDialog(true);
    setDialogTitle("Modifier chapter");
  };

  const confirmDeleteChapter = (chapter: any) => {
    setChapter(chapter);
    setDeleteChapterDialog(true);
  };

  const deleteChapter = () => {
    let _chapters: any = chapters.filter((val: any) => val._id !== chapter._id);

    chapterService
      .deleteChapter(chapter._id)
      .then((res) => {
        console.log(res);
        setChapters(_chapters);
        setDeleteChapterDialog(false);
        setChapter(emptyChapter);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Chapter Deleted",
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
    for (let i = 0; i < chapters.length; i++) {
      if (chapters[i]._id === id) {
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
    setDeleteChaptersDialog(true);
  };

  const deleteSelectedChapters = () => {
    console.log("selectedChapters---->", selectedChapters);
    let _chapters = chapters.filter(
      (val: any) => !selectedChapters.includes(val)
    );
    console.log("_chapters---->", _chapters);
    if (selectedChapters) {
      selectedChapters.map((chapter: any) =>
        chapterService.deleteChapter(chapter._id)
      );
    }
    setChapters(_chapters);
    setDeleteChaptersDialog(false);
    setSelectedChapters(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Chapters Deleted",
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
    let _chapter: any = { ...chapter };
    _chapter[`${name}`] = val;

    setChapter(_chapter);
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
          disabled={!selectedChapters || !selectedChapters.length}
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
          onClick={() => editChapter(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteChapter(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="m-0">Gestion des chapitres</h5>
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
  const chapterDialogFooter = (
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
        onClick={saveChapter}
      />
    </React.Fragment>
  );
  const deleteChapterDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteChapterDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteChapter}
      />
    </React.Fragment>
  );
  const deleteChaptersDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteChaptersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedChapters}
      />
    </React.Fragment>
  );

  return (
    <>
      <Sidebar currentActive="ChaptersManagment" />
      <TopBar title="gestion des chapitres " />
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
              value={chapters}
              selection={selectedChapters}
              onSelectionChange={(e) => setSelectedChapters(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} chapters"
              globalFilter={globalFilter}
              header={header}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
              ></Column>

              {columnComponents}
              <Column header="Operations" body={actionBodyTemplate}></Column>
            </DataTable>
          </div>
        </div>
        <Dialog
          visible={chapterDialog}
          style={{ width: "50%" }}
          header={dialogTitle}
          modal
          className="p-fluid"
          footer={chapterDialogFooter}
          onHide={hideDialog}
        >
          <br />
          <div className="formgrid grid">
            <small className="p-error">{error ? error : null}</small>
          </div>
          <br />
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="title">Titre</label>
              <InputText
                id="title"
                value={chapter.title}
                onChange={(e) => onInputChange(e, "title")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !chapter.title,
                })}
              />
              {submitted && !chapter.title && (
                <small className="p-error">Title is required.</small>
              )}
            </div>
          </div>
          <div className="formgrid grid">
            <div className="field col">
              <label htmlFor="category">Catégorie</label>
              <InputText
                id="category"
                value={chapter.category}
                onChange={(e) => onInputChange(e, "category")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !chapter.category,
                })}
              />
              {submitted && !chapter.category && (
                <small className="p-error">category is required.</small>
              )}
            </div>
            <div className="field col">
              <label htmlFor="description">Description</label>
              <InputText
                id="description"
                value={chapter.description}
                onChange={(e) => onInputChange(e, "description")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !chapter.description,
                })}
              />
              {submitted && !chapter.description && (
                <small className="p-error">description is required.</small>
              )}
            </div>
          </div>
        </Dialog>

        <Dialog
          visible={deleteChapterDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteChapterDialogFooter}
          onHide={hideDeleteChapterDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {chapter && (
              <span>
                Are you sure you want to delete <b>{chapter.title}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteChaptersDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteChaptersDialogFooter}
          onHide={hideDeleteChaptersDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {chapter && (
              <span>
                Are you sure you want to delete the selected chapters?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default ChaptersManagmentTest;
