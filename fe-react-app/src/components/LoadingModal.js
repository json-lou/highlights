import React from 'react'
import { Modal, Spinner } from 'react-bootstrap';

export default class LoadingModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
                size="sm"
                show={true}
                centered
                >
                <Modal.Body className="d-block text-center p-3">
                    <Spinner animation="border" size="xl" className="m-3" />
                    <span>
                        <h5>Loading</h5>
                    </span>
                </Modal.Body>
            </Modal>
        );
    }
}