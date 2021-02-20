import React from 'react'
import { Col, Container, Row, Pagination } from 'react-bootstrap';
import HighlightCard from './HighlightCard';
import LoadingModal from './LoadingModal';

export default class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: this.props.match.params.page,
            highlights: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const apiURL = `http://localhost:5000/highlights/${this.state.page}`;
        fetch(apiURL)
            .then((res) => res.json())
            .then((result) => {
                this.setState({ 
                    highlights: result.highlights,
                    isLoading: false
                });
            });
        console.log(this.state);
    }

    createGrid = () => {
        let rows = [];
        for (let i = 0; i < this.state.highlights.length; i++) {
            rows.push(
                <Col xs={12} lg={6} xl={4} className="no-gutters p-0">
                    <HighlightCard highlight={this.state.highlights[i]} className="p-1" />
                </Col>
            )
        }
        return rows;
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="PlayerView">
                    <LoadingModal show={this.state.isLoading} />
                </div>
            );
        } else {
            return (
                <div className="HomeView">
                    <Container fluid>
                        <Row className="p-2">
                            {this.createGrid()}
                        </Row>
                    </Container>
                    <hr />
                    <Container fluid>
                        <Row className="justify-content-center">
                            <Pagination>
                                <Pagination.First />
                                <Pagination.Prev />
                                <Pagination.Item>{11}</Pagination.Item>
                                <Pagination.Item active>{12}</Pagination.Item>
                                <Pagination.Item>{13}</Pagination.Item>
                                <Pagination.Next />
                                <Pagination.Last />
                            </Pagination>
                        </Row>
                    </Container>
                </div>
            );
        }
    }
}