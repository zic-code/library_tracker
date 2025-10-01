import { Form, ProgressBar, Button } from "react-bootstrap";

function ReadingStatusControl({ progress, onProgressChange, onSave, onDelete }) {
  return (
    <>
      <Form.Group>
        <Form.Label>Progress: {progress}%</Form.Label>
        <Form.Range value={progress} onChange={(e) => onProgressChange(e.target.value)} />
        <ProgressBar now={progress} className="mb-3" />
      </Form.Group>

      <div className="d-flex gap-3">
        <Button onClick={onSave} variant="primary">Save</Button>
        <Button onClick={onDelete} variant="danger">Delete</Button>
      </div>
    </>
  );
}

export default ReadingStatusControl;
