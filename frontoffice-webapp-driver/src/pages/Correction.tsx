import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import QuestionCard from "../components/QuestionCard";
import { TopBar } from "../components/TopBar";
import "./Correction.css";
import { QuestionService } from "../services/QuestionsService";
import { Question } from "../interfaces/question.interface";
import { getSavedState } from "../utils/LocalStorage.utils";
import LSVariables from "../configs/LS_variables.json";
import { AccountService } from "../services/AccountService";
import { AuthService } from "../services/AuthService";
import { Dialog } from "primereact/dialog";

const Correction = () => {
  const history = useHistory();
  const questionService = new QuestionService();
  const accountService = new AccountService();
  const authService = new AuthService();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const userAnswers: { id: string; answer: string }[] = getSavedState(
    LSVariables.saved_answer
  );

  useEffect(() => {
    const questionsIds = userAnswers.map((answer) => {
      return answer.id;
    });
    questionService.getWithAnswer(questionsIds).then((res: any) => {
      setQuestions(res.data.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserAnswer = (
    question: Question
  ): { key: string; name: string } | null => {
    let userAnswer = null;
    userAnswers.forEach((answer) => {
      if (answer.id === question._id) {
        userAnswer = {
          key: answer.answer,
          name: question[answer.answer as "answerA"],
        };
      }
    });

    return userAnswer;
  };

  const next = () => {
    if (getSavedState(LSVariables.test_finished)) {
      const driver = authService.getUser();
      accountService
        .SendTransporterEmail({
          id: driver.transporter,
          emailDriver: driver.email,
        })
        .then((res: any) => {
          if (res.data.message === "Email sent successfuly") {
            setDialogVisible(true);
          }
        });
    } else {
      history.push("test");
    }
  };

  const onHide = () => {
    setDialogVisible(false);
    localStorage.clear();
    history.push("/");
  };

  return (
    <>
      <TopBar title="Correction" />
      <br />
      <br />
      <br />
      <Card className="correction-card">
        <div className="questions-container">
          <h2 className="correction-chapitre__title">Chapitre 2</h2>
          {questions.map((question, idx) => {
            console.log(question);
            return (
              <QuestionCard
               isCorrection={true}
                key={idx}
                correctAnswers={question.correctAnswers}
                getUserAnswer={null}
                totalQuestionsNumber={questions.length}
                questionNumber={idx + 1}
                userAnswer={getUserAnswer(question)}
                questionAnnouncement={question.questionAnnouncement}
                answers={[
                  { name: question.answerA, key: "answerA" },
                  { name: question.answerB, key: "answerB" },
                  { name: question.answerC, key: "answerC" },
                  { name: question.answerD, key: "answerD" },
                ]}
              />
            );
          })}
          <Button
            onClick={() => next()}
            className="test-next__button"
            label="Suivant"
            icon="pi pi-check"
          />
          <br />
        </div>
      </Card>
      <br />
      <Dialog
        visible={dialogVisible}
        onHide={onHide}
        header={"Félicitation"}
        breakpoints={{ "960px": "75vw", "640px": "100vw" }}
        style={{ width: "50vw" }}
      >
        votre test est terminé avec succès, votre transporteur est en train de
        vous crée une certification qui sera envoyée par email
      </Dialog>
    </>
  );
};

export default Correction;
