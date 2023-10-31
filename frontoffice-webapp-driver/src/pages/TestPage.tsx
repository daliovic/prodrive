import { TopBar } from "../components/TopBar";
import { Carousel } from "primereact/carousel";
import { Steps } from "primereact/steps";
import QuestionCard from "../components/QuestionCard";
import "./TestPage.css";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useHistory } from "react-router";
import { useEffect, useState } from "react";
import { Chapter } from "../interfaces/chapter.interface";
import {
  deleteSavedState,
  getSavedState,
  setSavedState,
} from "../utils/LocalStorage.utils";
import LSVariables from "../configs/LS_variables.json";
import { Question } from "../interfaces/question.interface";
import { ChapterService } from "../services/ChapterService";
import { AuthService } from "../services/AuthService";
import { FileService } from "../services/FileService";

const Test = () => {
  const chapterService = new ChapterService();
  const authService = new AuthService();
  const fileService = new FileService();
  const history = useHistory();
  const responsiveOptions = [
    {
      breakpoint: "1920px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const [stepsItems, setStepsItems] = useState<{ label: string; id: string }[]>(
    []
  );
  const [images, setImages] = useState<{ image: string }[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswers, setCurrentAnswer] = useState<
    { name: string; key: string }[]
  >([]);
  const driver = authService.getUser();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [chapterNumber, setChapterNumber] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("answerA");
  const [questionAudio, setQuestionAudio] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<
    { id: string; answer: string }[]
  >([]);

  const productTemplate = (product: any) => {
    if (product.image.includes("mp4")) {
      return (
        <video controls preload="auto" width="100%">
          <source src={product.image} type="video/mp4" />
        </video>
      );
    } else {
      return <img width="100%" src={product.image} alt="sdf" />;
    }
  };
  useEffect(() => {
    const items: { label: string; id: string }[] = [];
    chapterService.getChaptersDetails(driver.transporter).then((res: any) => {
      const chapters: Chapter[] = res.data.data.chapters;
      chapters.forEach((chapter, chaptersIdx) => {
        items.push({
          id: chapter._id,
          label: chapter.title,
        });
        chapter.questions.forEach((quest, questionsIdx) => {
          quest.filesName.forEach((fileName, fileNamesIdx) => {
            if (fileName.includes(".mp3")) {
              setQuestionAudio(fileService.getFile(fileName));
              quest.filesName.splice(fileNamesIdx, 1);
            }
          });
        });
      });

      setChapters(chapters);
      setStepsItems(items);
      const savedChapter = getSavedState(LSVariables.current_chapter);
      if (savedChapter) {
        setCurrentChapter(savedChapter);
        setQuestionNumber(1);
        setChapterNumber(chapters.findIndex((x) => x._id === savedChapter._id));
        setCurrentQuestion(savedChapter.questions[0]);
        setCurrentAnswer(answerFilter(savedChapter.questions[0]));
        setImages(imagesFilter(savedChapter.questions[0]));
      } else {
        setQuestionNumber(1);
        setCurrentChapter(chapters[0]);
        setCurrentQuestion(chapters[0].questions[0]);
        setCurrentAnswer(answerFilter(chapters[0].questions[0]));
        setImages(imagesFilter(chapters[0].questions[0]));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imagesFilter = (question: Question): { image: string }[] => {
    const images: { image: string }[] = [];

    question.filesName.forEach((fileName: string) => {
      images.push({
        image: fileService.getFile(fileName),
      });
    });
    return images;
  };

  const answerFilter = (
    question: Question
  ): { name: string; key: string }[] => {
    return [
      {
        key: "answerA",
        name: question.answerA,
      },
      {
        key: "answerB",
        name: question.answerB,
      },
      {
        key: "answerC",
        name: question.answerC,
      },
      {
        key: "answerD",
        name: question.answerD,
      },
    ];
  };

  const next = () => {
    if (currentChapter && currentQuestion) {
      const questionIndex = currentChapter.questions.findIndex(
        (x) => x._id === currentQuestion._id
      );
      if (questionIndex === currentChapter.questions.length - 1) {
        setSavedState(
          [...userAnswers, { id: currentQuestion._id, answer: userAnswer }],
          LSVariables.saved_answer
        );
        chapterService
          .calculate([
            ...userAnswers,
            { id: currentQuestion._id, answer: userAnswer },
          ])
          .then((res: any) => {
            if (res.data.data === 100) {
              const chapterIndex = chapters.findIndex(
                (x) => x._id === currentChapter._id
              );
              if (chapterIndex === chapters.length - 1) {
                deleteSavedState(LSVariables.current_chapter);
                setSavedState(true, LSVariables.test_finished);
              } else {
                setSavedState(
                  chapters[chapterIndex + 1],
                  LSVariables.current_chapter
                );
              }
            }
            history.push("/resultat", { result: res.data.data });
          });
      } else if (
        questionIndex < currentChapter.questions.length &&
        questionIndex !== -1
      ) {
        setCurrentQuestion(currentChapter.questions[questionIndex + 1]);
        setCurrentAnswer(
          answerFilter(currentChapter.questions[questionIndex + 1])
        );
        setImages(imagesFilter(currentChapter.questions[questionIndex + 1]));
        setQuestionNumber(questionNumber + 1);
        setUserAnswers((answers) => [
          ...answers,
          { id: currentQuestion._id, answer: userAnswer },
        ]);
      }
    }
  };

  const getUserAnswer = (userAnswer: string) => {
    setUserAnswer(userAnswer);
  };

  return (
    <>
      <TopBar title="Test" />
      <br />
      <h2 style={{ textAlign: "center", color: "var(--text-color)" }}>
        {currentChapter?.title}
      </h2>
      <br />
      <br />
      <div className="test-container">
        <Carousel
          className="test-carousel__images"
          value={images}
          numVisible={3}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
        <div className="test-question__card">
          {currentChapter && currentAnswers.length && (
            <Card>
              <QuestionCard
                isCorrection={false}
                correctAnswers={null}
                userAnswer={null}
                totalQuestionsNumber={currentChapter.questions.length}
                questionNumber={questionNumber}
                questionAnnouncement={
                  currentQuestion ? currentQuestion.questionAnnouncement : ""
                }
                answers={currentAnswers}
                getUserAnswer={getUserAnswer}
              />
              <br />
              <Button
                className="test-next__button"
                label="Suivant"
                icon="pi pi-check"
                onClick={() => next()}
              />
              <br />
            </Card>
          )}
        </div>
        <br />
      </div>
      <br />
      <Steps model={stepsItems} activeIndex={chapterNumber} />

      {questionAudio && (
        <audio className={"audio-element"} controls autoPlay={true}>
          <source src={questionAudio} type="audio/mpeg" />
        </audio>
      )}
    </>
  );
};
export default Test;
