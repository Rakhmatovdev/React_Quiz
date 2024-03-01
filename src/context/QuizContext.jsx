import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext({});

const SECONDS_PRE_QUESTIONS = 20;

const initialState = {
  question:  [
    {
      "question": "Which is the most popular JavaScript framework?",
      "options": ["Angular", "React", "Svelte", "Vue"],
      "correctOption": 1,
      "points": 10
    },
    {
      "question": "Which company invented React?",
      "options": ["Google", "Apple", "Netflix", "Facebook"],
      "correctOption": 3,
      "points": 10
    },
    {
      "question": "What's the fundamental building block of React apps?",
      "options": ["Components", "Blocks", "Elements", "Effects"],
      "correctOption": 0,
      "points": 10
    },
    {
      "question": "What's the name of the syntax we use to describe the UI in React components?",
      "options": ["FBJ", "Babel", "JSX", "ES2015"],
      "correctOption": 2,
      "points": 10
    },
    {
      "question": "How does data flow naturally in React apps?",
      "options": [
        "From parents to children",
        "From children to parents",
        "Both ways",
        "The developers decides"
      ],
      "correctOption": 0,
      "points": 10
    },
    {
      "question": "How to pass data into a child component?",
      "options": ["State", "Props", "PropTypes", "Parameters"],
      "correctOption": 1,
      "points": 10
    },
    {
      "question": "When to use derived state?",
      "options": [
        "Whenever the state should not trigger a re-render",
        "Whenever the state can be synchronized with an effect",
        "Whenever the state should be accessible to all components",
        "Whenever the state can be computed from another state variable"
      ],
      "correctOption": 3,
      "points": 30
    },
    {
      "question": "What triggers a UI re-render in React?",
      "options": [
        "Running an effect",
        "Passing props",
        "Updating state",
        "Adding event listeners to DOM elements"
      ],
      "correctOption": 2,
      "points": 20
    },
    {
      "question": "When do we directly \"touch\" the DOM in React?",
      "options": [
        "When we need to listen to an event",
        "When we need to change the UI",
        "When we need to add styles",
        "Almost never"
      ],
      "correctOption": 3,
      "points": 20
    },
    {
      "question": "In what situation do we use a callback to update state?",
      "options": [
        "When updating the state will be slow",
        "When the updated state is very data-intensive",
        "When the state update should happen faster",
        "When the new state depends on the previous state"
      ],
      "correctOption": 3,
      "points": 30
    },
    {
      "question": "If we pass a function to useState, when will that function be called?",
      "options": [
        "On each re-render",
        "Each time we update the state",
        "Only on the initial render",
        "The first time we update the state"
      ],
      "correctOption": 2,
      "points": 30
    },
    {
      "question": "Which hook to use for an API request on the component's initial render?",
      "options": ["useState", "useEffect", "useRef", "useReducer"],
      "correctOption": 1,
      "points": 10
    },
    {
      "question": "Which variables should go into the useEffect dependency array?",
      "options": [
        "Usually none",
        "All our state variables",
        "All state and props referenced in the effect",
        "All variables needed for clean up"
      ],
      "correctOption": 2,
      "points": 30
    },
    {
      "question": "An effect will always run on the initial render.",
      "options": [
        "True",
        "It depends on the dependency array",
        "False",
        "In depends on the code in the effect"
      ],
      "correctOption": 0,
      "points": 30
    },
    {
      "question": "When will an effect run if it doesn't have a dependency array?",
      "options": [
        "Only when the component mounts",
        "Only when the component unmounts",
        "The first time the component re-renders",
        "Each time the component is re-rendered"
      ],
      "correctOption": 3,
      "points": 20
    }
  ], //[] bolishi kerak edi
  status: "ready", //loading bolishi kerak edi
  index: 0,
  answer: null,
  points: 0,
  timer: 0,
  record:0
};

function reducer(state, action) {
  switch (action.type) {
    // case "dataRecived":
      // return (state = { ...state, question: action.payload, status: "ready" });
    case "dataFailed":
      return (state = { ...state, status: "error" });
    case "start":
      return (state = {
        ...state,
        status: "active",
        timer: state.question.length * SECONDS_PRE_QUESTIONS,
      });
    case "answer": {
      return { ...state, answer: action.payload };
    }
    case "newAnswer": {
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        points:
          state.answer === state.question[state.index].correctOption
            ? state.points + state.question[state.index].points
            : state.points,
      };
    }
    case "restart": {
      return { ...state, status: "ready", answer: null, index: 0, points: 0 };
    }
    case "tick": {
      return {
        ...state,
        timer: (state.timer -= 1),
        status: state.timer <= 0 ? "finish" : state.status,
      };
    }
    case "finish":
      return {
        ...state,
        status: "finish",
        record:state.points>=state.record?state.points:state.record
      };
    default:
      throw new Error("No such action");
  }
}

const QuizContextProvider = ({ children }) => {
  const [{ question, status, index, answer, points, timer,record }, dispatch] =
    useReducer(reducer, initialState);

  let numberOfQuestions = question.length;
  const totalQustionPoint = question.length > 0 && question.reduce((calc, b) => calc + b.points, 0);

  // useEffect(() => {
  //   fetch(`http://localhost:7777/questions`)
  //     .then((res) => res.json())
  //     .then((data) => dispatch({ type: "dataRecived", payload: data }))
  //     .catch((error) => dispatch({ type: "dataFailed" }));
  // }, []);
  return (
    <QuizContext.Provider
      value={{
        index,
        question,
        status,
        answer,
        points,
        timer,
        dispatch,
        numberOfQuestions,
        totalQustionPoint,
        record
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);

export default QuizContextProvider;
