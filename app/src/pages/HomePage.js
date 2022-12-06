import { useState } from 'react'

import { ToggleButton } from 'react-bootstrap';
import { ToggleButtonGroup } from 'react-bootstrap';

import DashboardLayout from '../Layout/DashboardLayout';
import '../css/homepage/homepage.scss'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../components/auth-provider';

const HomePage = () => {
  const [index, setIndex] = useState(0)
  const {role, skip} = useAuth()

  if (role === 'admin') return <Navigate to='/dashboard/admin' />
  if (skip === 'true') return <Navigate to="/dashboard/search-class"/>

  const questionnaire = [
    {
      question: 'Which of these best describes your major',
      type: 'choice',
      answer: 0,
      answerKey: ['Programming', 'Physical Science', 'Statistics', 'Other']
    },
    {
      question: 'Level of skill',
      type: 'choice',
      answer: 0,
      answerKey: ['Beginner', 'Intermediate', 'Proficient', 'Expert']
    },
  ]

  const nextQuestion = () => {
    if (index < questionnaire.length - 1) {
      setIndex(index + 1)
    } else {

     return <Navigate to='/dashboard/search-class' />
    }
  }

  const selectedAnswer = (idx, answer) => {
    questionnaire[idx].answer = answer
    nextQuestion()
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto text-center">
        <h3 className="mb-4">{questionnaire[index].question}</h3>
        {questionnaire[index].type === 'choice' ?
          <>
            <ToggleButtonGroup type="radio" name="options" className="w-100">
              {questionnaire[index].answerKey.map((obj, i) => {
                return <ToggleButton key={i} className="mx-3 rounded w-75"  value={i} onClick={() => selectedAnswer(index, i)} > {obj} </ToggleButton>
              })}
            </ToggleButtonGroup>
          </>:
          false
        }
      </div>
    </DashboardLayout>
  );
}
export default HomePage;
