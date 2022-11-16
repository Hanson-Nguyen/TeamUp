import { Button, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

import DashboardLayout from "../Layout/DashboardLayout";
import "../css/class/create-class.scss";

const SearchClass = () => {
  const [singleSelections, setSingleSelections] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  return (
    <>
      <DashboardLayout>
        <div className="class-create-form">
          <h4>Search Class</h4>
          <Form>
            <Form.Group className="mb-3" controlId="formClassName">
              <Form.Label>Class Name</Form.Label>
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                onChange={setSingleSelections}
                options={[
                  "Class 1",
                  "Class 2",
                  "Class 3",
                  "Class 4",
                  "Class 5",
                  "Class 6",
                  "Class 7",
                ]}
                placeholder="Choose a class"
                selected={singleSelections}
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={() => setShowSuccessMessage(true)}
            >
              Join
            </Button>
          </Form>

          <Modal
            show={showSuccessMessage}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop={true}
            onHide={() => setShowSuccessMessage(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Join Class
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>successfully registered class</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowSuccessMessage(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </DashboardLayout>
    </>
  );
};
export default SearchClass;
