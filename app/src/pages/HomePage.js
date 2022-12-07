import { useState } from 'react'

import { ToggleButton } from 'react-bootstrap';
import { ToggleButtonGroup } from 'react-bootstrap';

import DashboardLayout from '../Layout/DashboardLayout';
import '../css/homepage/homepage.scss'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../components/auth-provider';
import apiStore from '../components/api-store';

const HomePage = () => {
  const [index, setIndex] = useState(0)
  const { role, skip, token } = useAuth()

  const questionnaire = [
    {
      question: 'Which of these best describes your major?',
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
    {
      question: 'Do Any of these programming languages apply to you?',
      type: 'choice',
      answer: 0,
      answerKey: ['Python', 'R', 'Java', 'No']
    },
    {
      question: 'How will you use TeamUp?',
      type: 'choice',
      answer: 0,
      answerKey: ['Mentorship', 'Practice', 'Coordinating', 'Networking']
    }
  ]

  if (role === 'admin') return <Navigate to='/dashboard/admin' />
  if (skip === 'true') return <Navigate to="/dashboard/search-class" />


  const selectedAnswer = (idx, answer) => {
    questionnaire[idx].answer = answer
    setIndex(index + 1)

    if (index === questionnaire.length - 1) {
      const total = questionnaire.reduce((acc, answer) => acc + answer, 0)
     apiStore.tagUser(token, {total})
        .then(res => res.json())
        .catch()

      window.localStorage.setItem("skip_w", true)
    }
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto text-center">
        {
          index < questionnaire.length
            ? <>
              <h3 className="mb-4">{questionnaire[index].question}</h3>
              {questionnaire[index].type === 'choice' ?
                <>
                  <ToggleButtonGroup type="radio" name="options" className="w-100">
                    {questionnaire[index].answerKey.map((obj, i) => {
                      return <ToggleButton key={i} className="mx-3 rounded w-75" value={i} onClick={() => selectedAnswer(index, i)} > {obj} </ToggleButton>
                    })}
                  </ToggleButtonGroup>
                </> :
                false
              }
            </>
            : <Navigate to="/dashboard/search-class" />
        }
      </div>
    </DashboardLayout>
  );
}
export default HomePage;
