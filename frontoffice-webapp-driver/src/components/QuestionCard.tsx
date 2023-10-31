import { FC, useEffect, useState } from "react";
import { RadioButton } from "primereact/radiobutton";
import "./QuestionCard.css";

interface Props {
  questionNumber: number;
  totalQuestionsNumber: number;
  questionAnnouncement: string;
  isCorrection: boolean;
  correctAnswers: string[] | null;
  userAnswer: {
    name: string;
    key: string;
  } | null;
  answers: {
    name: string;
    key: string;
  }[];
  getUserAnswer: ((userAnswer: string) => void) | null;
}

const QuestionCard: FC<Props> = ({
  isCorrection,
  questionNumber,
  totalQuestionsNumber,
  questionAnnouncement,
  correctAnswers,
  userAnswer,
  answers,
  getUserAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(
    userAnswer ? userAnswer : answers[0]
  );

  useEffect(() => {
    console.log(isCorrection);
  }, [isCorrection]);
  return (
    <>
      <h3 className="question__title">
        Question {questionNumber}/{totalQuestionsNumber}
      </h3>
      <br />
      <p className="question__announcement">{questionAnnouncement}</p>
      <br />
      <br />
      {answers.map((answer) => {
        return (
          <div key={answer.key} className="field-radiobutton">
            <RadioButton
              inputId={answer.key}
              name="category"
              value={answer}
              onChange={(e) => {
                setSelectedAnswer(e.value);
                if (getUserAnswer) {
                  getUserAnswer(e.value.key);
                }
              }}
              checked={selectedAnswer.key === answer.key}
              disabled={getUserAnswer === null}
            />
            <h1>{isCorrection}</h1>
            <label
              htmlFor={answer.key}
              className={`${
                // correctAnswers === answer.key && userAnswer
                correctAnswers?.includes(answer.key) && userAnswer
                  ? "right-answer-label"
                  : isCorrection
                  ? "false-answer-label"
                  : ""
              }`}
            >
              {answer.name}
            </label>
          </div>
        );
      })}
    </>
  );
};
export default QuestionCard;
