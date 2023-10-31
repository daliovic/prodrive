import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { FileUpload, FileUploadSelectParams } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { TopBar } from "../components/TopBar";
import { Chapter } from "../interfaces/chapters.interface";
import { Question } from "../interfaces/questions.interface";
import { ChapterService } from "../service/ChapterService";
import { QuestionService } from "../service/QuestionService";
import "./QuestionsManagment.css";

const QuestionsManagmentTest = () => {
  const columns = [
    { field: "questionAnnouncement", header: "Ennoncé" },
    { field: "category", header: "Catégorie" },
    { field: "answerA", header: "réponseA" },
    { field: "answerB", header: "réponseB" },
    { field: "answerC", header: "réponseC" },
    { field: "answerD", header: "réponseD" },
    { field: "correctAnswers", header: "Réponses Correctes" },
    { field: "chapter", header: "Chapitre" },
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
  let emptyQuestion = {
    _id: "",
    questionAnnouncement: "",
    category: "",
    answerA: "",
    answerB: "",
    answerC: "",
    answerD: "",
    correctAnswers: [],
    chapter: "",
    filesName: [],
  };

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsWithChapterName, setQuestionsWithChapterName] = useState<
    Question[]
  >([]);
  const [questionDialog, setQuestionDialog] = useState(false);
  const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);
  const [deleteQuestionsDialog, setDeleteQuestionsDialog] = useState(false);
  const [question, setQuestion] = useState<Question>(emptyQuestion);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast: any = useRef(null);
  const dt: any = useRef(null);
  const questionService = new QuestionService();
  const chapterService = new ChapterService();
  const [dialogTitle, setDialogTitle] = useState("");
  const [error, setError] = useState(null);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedCorrectAnswers, setSelectedCorrectAnswers] = useState<any>([]);
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const answers = [
    { answer: "answerA", label: "A" },
    { answer: "answerB", label: "B" },
    { answer: "answerC", label: "C" },
    { answer: "answerD", label: "D" },
  ];

  useEffect(() => {
    console.log("useEffect", selectedCorrectAnswers);
  }, [selectedCorrectAnswers]);

  useEffect(() => {
    setIsLoadingTable(true);
    chapterService
      .getChapters()
      .then((chapterRes) => {
        setChapters(chapterRes.data.data);
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
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoadingTable(true);
    questionService
      .getQuestions()
      .then((questionRes) => {
        setQuestions(questionRes.data.data);
        setQuestionsWithChapterName(
          getQuestionsWithChapterName(questionRes.data.data)
        );
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
          setError(err.response.data.message);
        }
      });
  }, [chapters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedChapter) {
      let _question: any = { ...question };
      _question["chapter"] = selectedChapter._id || "";
      setQuestion(_question);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapter]);

  const getQuestionsWithChapterName = (
    questionsData: Question[]
  ): Question[] => {
    const questionsWithChapterName: Question[] = [];

    for (let i = 0; i < questionsData.length; i++) {
      let questionItem = { ...questionsData[i] };
      for (let j = 0; j < chapters.length; j++) {
        if (questionItem.chapter === chapters[j]._id) {
          questionItem.chapter = chapters[j].title;
          questionsWithChapterName.push(questionItem);
        }
      }
    }

    return questionsWithChapterName;
  };

  const openNew = () => {
    setError(null);
    setQuestion(emptyQuestion);
    setSubmitted(false);
    setQuestionDialog(true);
    setDialogTitle("Créer une question");
  };

  const hideDialog = () => {
    setError(null);
    // setQuestion(emptyQuestion);
    setSubmitted(false);
    setSelectedChapter(null);
    setSelectedCorrectAnswers(null);
    setQuestionDialog(false);
  };

  const hideDeleteQuestionDialog = () => {
    setDeleteQuestionDialog(false);
  };

  const hideDeleteQuestionsDialog = () => {
    setDeleteQuestionsDialog(false);
  };

  const saveQuestion = () => {
    setSubmitted(true);
    if (question.questionAnnouncement.trim()) {
      let formData = new FormData();
      selectedFiles.forEach((file: File) => {
        formData.append("file", file);
      });
      let _questions: any = [...questions];
      let _question: any = { ...question };
      for (const [key, value] of Object.entries(_question)) {
        if (value) {
          formData.append(key, value as string);
        }
      }

      if (question._id) {
        setIsLoadingForm(true);
        //editBlock
        const { __v, ...cleanQuestion } = _question;

        questionService
          .updateQuestion(
            question._id,
            selectedFiles.length ? formData : cleanQuestion
          )
          .then((res) => {
            const index = findIndexById(question._id);

            _questions[index] = _question;
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Question Updated",
              life: 3000,
            });
            setError(null);
            // setQuestion(emptyQuestion);
            setQuestions(_questions);
            setQuestionsWithChapterName(
              getQuestionsWithChapterName(_questions)
            );
            setIsLoadingForm(false);
            setQuestionDialog(false);
            setSelectedChapter(null);
            setSelectedCorrectAnswers([]);
            setSelectedFiles([]);
          })
          .catch((err) => {
            setIsLoadingForm(false);
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
        // console.table(_question);
        let questionWithChapterTitle: any = { ..._question };

        questionWithChapterTitle["chapter"] = selectedChapter
          ? selectedChapter.title
          : "";
        // questionWithChapterTitle["correctAnswers"] = selectedCorrectAnswers.map(
        //   (item: any) => item.answer
        // );
        // questionWithChapterTitle["correctAnswers"] =["answerA","answerB","answerC","answerD"];
        console.log("questionWithChapterTitle", questionWithChapterTitle);
        // questionWithChapterTitle["correctAnswers"] = selectedCorrectAnswers.map(
        //   (item: any) => item.answer
        // );
        console.log("selectedCorrectAnswers", selectedCorrectAnswers);
        console.log("questionWithChapterTitle", questionWithChapterTitle);
        if (selectedCorrectAnswers) {
          let answer = selectedCorrectAnswers.map((item: any) => item.answer);
          formData.append("correctAnswers", JSON.stringify(answer));
          // console.log(answer);
        }
        // questionWithChapterTitle["correctAnswers"] = "answerA";

        questionService
          .addQuestion(formData)
          .then((res) => {
            questionWithChapterTitle["_id"] = res.data.data._id;
            _question["_id"] = res.data.data._id;
            _questions.push(_question);
            // _questions.push(res.data.data);
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Question Created",
              life: 3000,
            });

            setQuestions([..._questions, _question]);
            setQuestionsWithChapterName([
              ...questionsWithChapterName,
              questionWithChapterTitle,
            ]);
            setQuestionDialog(false);
            setQuestion(emptyQuestion);
            setSelectedChapter(null);
            setSelectedCorrectAnswers([]);
            setSelectedFiles([]);
          })
          .catch((err) => {
            // console.log(err);
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

  const editQuestion = (question: Question) => {
    setQuestion(question);
    const questionWithIds = questions.find(
      (quest) => quest._id === question._id
    );
    if (questionWithIds) {
      const chapter = chapters.find(
        (chap) => chap._id === questionWithIds.chapter
      );
      if (chapter) {
        setSelectedChapter(chapter);
      }
    }
    setQuestionDialog(true);
    setDialogTitle("Modifier question");
  };

  const confirmDeleteQuestion = (question: any) => {
    setQuestion(question);
    setDeleteQuestionDialog(true);
  };

  const deleteQuestion = () => {
    questionService
      .deleteQuestion(question._id)
      .then((res) => {
        let _questions: any = questions.filter(
          (val: any) => val._id !== question._id
        );

        setQuestions(_questions);
        setQuestionsWithChapterName(getQuestionsWithChapterName(_questions));
        setDeleteQuestionDialog(false);
        setQuestion(emptyQuestion);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Question Deleted",
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

  const onSelectFile = (e: FileUploadSelectParams) => {
    setSelectedFiles([...selectedFiles, ...e.files]);
  };
  const onRemoveFile = (e: any) => {
    setSelectedFiles(
      selectedFiles.filter((item: File) => item.name !== e.file.name)
    );
  };

  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < questions.length; i++) {
      if (questions[i]._id === id) {
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
    setDeleteQuestionsDialog(true);
  };

  const deleteSelectedQuestions = () => {
    let _questions = questions.filter((quest: Question) => {
      let deleted = true;
      selectedQuestions.forEach((selectedQuestion) => {
        if (selectedQuestion._id === quest._id) {
          deleted = false;
        }
      });

      return deleted;
    });
    if (selectedQuestions) {
      selectedQuestions.map((question: any) =>
        questionService.deleteQuestion(question._id)
      );
    }

    setQuestions(_questions);
    setQuestionsWithChapterName(getQuestionsWithChapterName(_questions));
    setDeleteQuestionsDialog(false);
    setSelectedQuestions([]);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Questions Deleted",
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
    let _question: any = { ...question };
    _question[`${name}`] = val;

    setQuestion(_question);
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
          disabled={!selectedQuestions || !selectedQuestions.length}
        />
      </React.Fragment>
    );
  };
  const onChapterChange = (e: { value: any }) => {
    if (e && e.value) {
      setSelectedChapter(e.value);
    } else {
      setSelectedChapter(null);
    }
  };
  const onCorrectAnswerChange = (e: { value: any }) => {
    if (e && e.value) {
      setSelectedCorrectAnswers(e.value);

      let _question: any = { ...question };
      _question["correctAnswers"] = e.value.answer || "";
      setQuestion(_question);
    } else {
      setSelectedCorrectAnswers(null);
    }
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
          onClick={() => editQuestion(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteQuestion(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="m-0">Gestion des questions</h5>
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
  const questionDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        loadingIcon
        loading={isLoadingForm}
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveQuestion}
      />
    </React.Fragment>
  );
  const deleteQuestionDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteQuestionDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteQuestion}
      />
    </React.Fragment>
  );
  const deleteQuestionsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteQuestionsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedQuestions}
      />
    </React.Fragment>
  );

  return (
    <>
      <Sidebar currentActive="QuestionsManagment" />
      <TopBar title="gestion des questions " />
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
              value={questionsWithChapterName}
              selection={selectedQuestions}
              onSelectionChange={(e) => setSelectedQuestions(e.value)}
              dataKey="_id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} questions"
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
        <BlockUI fullScreen blocked={isLoadingForm}>
          <Dialog
            visible={questionDialog}
            style={{ width: "50%" }}
            header={dialogTitle}
            modal
            className="p-fluid"
            footer={questionDialogFooter}
            onHide={hideDialog}
          >
            <br />
            <div className="formgrid grid">
              <small className="p-error">{error ? error : null}</small>
            </div>
            <br />
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="questionAnnouncement">Ennoncé</label>
                <InputText
                  id="questionAnnouncement"
                  value={question.questionAnnouncement}
                  onChange={(e) => onInputChange(e, "questionAnnouncement")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !question.questionAnnouncement,
                  })}
                />
                {submitted && !question.questionAnnouncement && (
                  <small className="p-error">
                    question Announcement is required.
                  </small>
                )}
              </div>

              <div className="field col">
                <label htmlFor="category">Categorie</label>
                <InputText
                  id="category"
                  value={question.category}
                  onChange={(e) => onInputChange(e, "category")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !question.category,
                  })}
                />
                {submitted && !question.category && (
                  <small className="p-error">Last Name is required.</small>
                )}
              </div>

              <div className="field col">
                <label htmlFor="chapter">Chapitre</label>

                <Dropdown
                  // valueTemplate={selectedChapter ? null : question.chapter}
                  value={selectedChapter}
                  options={chapters}
                  onChange={(e) => onChapterChange(e)}
                  optionLabel="title"
                  // filter
                  // showClear
                  // filterBy="title"
                  placeholder="Select a chapter"
                />
                {submitted && !question.chapter && (
                  <small className="p-error">Chapter is required.</small>
                )}
              </div>
            </div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="answerA">Réponse A</label>
                <InputText
                  id="answerA"
                  value={question.answerA}
                  onChange={(e) => onInputChange(e, "answerA")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !question.answerA,
                  })}
                />
                {submitted && !question.answerA && (
                  <small className="p-error">answerA is required.</small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="answerB">Réponse B</label>
                <InputText
                  id="answerB"
                  value={question.answerB}
                  onChange={(e) => onInputChange(e, "answerB")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !question.answerB,
                  })}
                />
                {submitted && !question.answerB && (
                  <small className="p-error">AnswerB is required.</small>
                )}
              </div>

              <div className="field col">
                <label htmlFor="answerC">Réponse C</label>
                <InputText
                  id="answerC"
                  value={question.answerC}
                  onChange={(e) => onInputChange(e, "answerC")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !question.answerC,
                  })}
                />
                {submitted && !question.answerC && (
                  <small className="p-error">Answer C is required.</small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="answerD">Réponse D</label>
                <InputText
                  id="answerD"
                  value={question.answerD}
                  onChange={(e) => onInputChange(e, "answerD")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !question.answerD,
                  })}
                />
                {submitted && !question.answerD && (
                  <small className="p-error">AnswerD is required.</small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="correctAnswers">Réponses Correctes</label>

                <MultiSelect
                  placeholder="Select a correct answer"
                  value={selectedCorrectAnswers ? selectedCorrectAnswers : null}
                  options={answers}
                  optionLabel="label"
                  onChange={(e) => onCorrectAnswerChange(e)}
                  style={{ width: "20em" }}
                />
                {/* <Dropdown
                  valueTemplate={
                    selectedCorrectAnswer ? null : question.correctAnswer
                  }
                  value={selectedCorrectAnswer ? selectedCorrectAnswer : null}
                  options={answers}
                  onChange={(e) => onCorrectAnswerChange(e)}
                  optionLabel="label"
                  placeholder="Select a correct answer"
                /> */}

                {submitted && !question.correctAnswers && (
                  <small className="p-error">Correct answer is required.</small>
                )}
              </div>
            </div>
            <div className="field col">
              <label htmlFor="images">Images</label>
              <FileUpload
                multiple
                onSelect={onSelectFile}
                onRemove={onRemoveFile}
                accept="image/*|video/*"
                maxFileSize={30000000}
                emptyTemplate={
                  <p className="p-m-0">
                    Drag and drop files to here to upload.
                  </p>
                }
              />
            </div>
          </Dialog>
        </BlockUI>

        <Dialog
          visible={deleteQuestionDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteQuestionDialogFooter}
          onHide={hideDeleteQuestionDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {question && (
              <span>
                Are you sure you want to delete{" "}
                <b>{question.questionAnnouncement}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteQuestionsDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteQuestionsDialogFooter}
          onHide={hideDeleteQuestionsDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {question && (
              <span>
                Are you sure you want to delete the selected questions?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </>
  );
};
export default QuestionsManagmentTest;
