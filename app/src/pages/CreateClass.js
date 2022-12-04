import { Button, Form } from "react-bootstrap";
import DashboardLayout from "../Layout/DashboardLayout";
import "../css/class/create-class.scss";
import { useAuth } from "../components/auth-provider";
import { Navigate } from "react-router-dom";


const CreateClass = () => {
  const {role} = useAuth()

  if (role !== "contributor") return <Navigate to='/dashboard' />

  return (
    <>
      <DashboardLayout>
        <div className="class-create-form">
          <h4>Create Class</h4>
          <Form>
            <Form.Group className="mb-3" controlId="formClassName">
              <Form.Label>Class Name</Form.Label>
              <Form.Control type="text" placeholder="Enter class name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formClassStrength">
              <Form.Label>Class Strength</Form.Label>
              <Form.Control type="text" placeholder="Enter class strength" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formClassTiming">
              <Form.Label>Class timings</Form.Label>
              <Form.Control type="date" placeholder="Enter class timings" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formClassCode">
              <Form.Label>Class code</Form.Label>
              <Form.Control type="text" placeholder="Enter class code" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </DashboardLayout>
    </>
  );
};
export default CreateClass;
