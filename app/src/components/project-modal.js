import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import apiStore from './api-store';
import { useAuth } from './auth-provider';

const ProjectModal = (props) => {
  const { token } = useAuth()

  const initialFormState = {
    name: '',
    description: '',
    size: 0,
    tag: ''
  }

  const sizeDropdown = [2, 4, 6, 8, 10, 12]
  const tagDropdown = ['sports', 'science', 'programming']
  const [formState, setFormState] = useState(initialFormState)

  useEffect(() => {
    if (props.edit && props.edit > 0) {
      apiStore.getProjectById(props.edit, token, true)
        .then(res => setFormState(_formState => ({
          ..._formState,
          ...res
        })))
        .catch()
    }
  }, [token, props.edit])

  useEffect(() => {
    if (props.view && props.view > 0) {
      apiStore.getProjectById(props.view, token, true)
        .then(res => setFormState(_formState => ({
          ..._formState,
          ...res
        })))
        .catch()
    }
  }, [token, props.view])

  const onSubmit = async (e) => {
    e.preventDefault()

    const res = Object.keys(props).length
      ? await apiStore.updateProject(props.edit, token, formState)
      : await apiStore.createProject(token, formState)

    if (formState.published) {
      await apiStore.publishProject(props.edit, token)
    }
    if (res.error) {
      return
    }
  }

  const onJoin = async (e) => {
    e.preventDefault()

    const res = await apiStore.joinProject(props.view, token)
    console.log('is this running')
    if (res.error) {
      return
    }
  }

  const handleChange = (e, property) => {
    let updatedValue = {}
    updatedValue = { [property]: e.target.value }
    setFormState(_formState => ({
      ..._formState,
      ...updatedValue
    }
    ))
  }

  const handleSelect = (e, property) => {
    let updatedValue = {}
    updatedValue = { [property]: property === 'size' ? parseInt(e) : e }

    setFormState(_formState => ({
      ..._formState,
      ...updatedValue
    }))
  }

  const handleCheck = (e, property) => {
    let updatedValue = {}
    updatedValue = { [property]: e.target.checked }
    console.log(e.target.checked)

    setFormState(_formState => ({
      ..._formState,
      ...updatedValue
    }))
  }

  const ContributorView = () => (
    <Form onSubmit={onSubmit}>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Project Name</Form.Label>
        <Form.Control type="text" placeholder="Enter project name..." defaultValue={formState.name} onChange={(e) => handleChange(e, 'name')} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" placeholder="Breif description of project..." defaultValue={formState.description} onChange={(e) => handleChange(e, 'description')} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicSize">
        <Form.Label>Size</Form.Label>
        <DropdownButton
          variant="outline-secondary"
          title={formState.size ? formState.size : "--Select--"}
          id="input-group-dropdown-1"
          onSelect={(e) => handleSelect(e, 'size')}
        >
          {sizeDropdown.map(item => (
            <Dropdown.Item key={item} eventKey={item}>{item}</Dropdown.Item>
          ))}
        </DropdownButton>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicSize">
        <Form.Label>Tags</Form.Label>
        <DropdownButton
          variant="outline-secondary"
          title={formState.tag ? formState.tag : "--Select--"}
          id="input-group-dropdown-2"
          onSelect={(e) => handleSelect(e, 'tag')}
        >
          {tagDropdown.map(item => (
            <Dropdown.Item key={item} eventKey={item}>{item}</Dropdown.Item>
          ))}
        </DropdownButton>
      </Form.Group>
      {Object.keys(props).length ? (<>
        <Form.Group className="mb-3" controlId="formBasicPublish">
          <Form.Label>Publish</Form.Label>
          <Form.Check onChange={(e) => handleCheck(e, 'published')} defaultValue={formState.published}></Form.Check>
        </Form.Group>
      </>) : false}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  )

  const BasicView = () => (
    <Form onSubmit={onJoin}>
      <Form.Group className="mb-3" controlId="formBasicName">
        <Form.Label>Project Name</Form.Label>
        <Form.Control type="text" placeholder="Enter project name..." defaultValue={formState.name} disabled />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" placeholder="Breif description of project..." defaultValue={formState.description} disabled />
      </Form.Group>
      <Button variant="primary" type="submit">
        Join
      </Button>
    </Form>
  )

  return (
    <>
      {props.hasOwnProperty('view') ? BasicView() : ContributorView()}
    </>
  )
};
export default ProjectModal;
