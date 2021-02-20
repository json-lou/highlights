import React from 'react'
import ReactPlayer from 'react-player'
import { Container, Col, Row, ProgressBar } from 'react-bootstrap';
import { ThumbsupIcon, ThumbsdownIcon, ScreenFullIcon } from '@primer/octicons-react'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.vid = this.props.highlight['vid'];
        this.url = this.props.highlight['url'];
        this.rating = parseFloat(this.props.highlight['rating']) * 100;
    }

    render() {
        return (
            <div className="HighlightCard">
                <Container className="p-2" fluid>
                    <Row className="player-wrapper">
                        <ReactPlayer
                            className="react-player"
                            url={this.url}
                            height="100%"
                            width="100%"
                        />
                    </Row>
                    <Row className="mx-auto">
                        <Col className="p-0">
                            <ProgressBar className="custom-progress">
                                <ProgressBar variant="success" now={this.rating} key={1} />
                                <ProgressBar variant="danger" now={100 - this.rating} key={2} />
                            </ProgressBar>
                        </Col>
                    </Row>
                    <Row className="mx-auto">
                        <Col className="highlight-action border text-center p-2"><ThumbsupIcon size="small" /></Col>
                        <Col className="highlight-action border text-center p-2"><ThumbsdownIcon size="small" /></Col>
                        <Col className="highlight-action border text-center p-2"><ScreenFullIcon size="small" /></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
