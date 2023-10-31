import {Question} from "./question.interface";

export interface Chapter {
    _id: string;
    title: string;
    category: string;
    description: string;
    questions: Question[]
}