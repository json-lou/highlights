import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap';
import HighlightCard from './HighlightCard';
import LoadingModal from './LoadingModal';

export default class PlayerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pid: this.props.match.params.pid,
            page: this.props.match.params.page,
            player: {},
            team: {},
            highlights: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const apiURL = `http://localhost:5000/players/${this.state.pid}/${this.state.page}`;
        fetch(apiURL)
            .then((res) => res.json())
            .then((result) => {
                this.setState({ 
                    player: result.player,
                    team: result.team,
                    highlights: result.highlights,
                    isLoading: false
                });
            });
        console.log(this.state);
    }

    getPlayerHeadshot = (pid) => {
        return `https://cdn.nba.com/headshots/nba/latest/1040x760/${this.state.pid}.png`;
    }

    createGrid = () => {
        let rows = [];
        for (let i = 0; i < this.state.highlights.length; i++) {
            rows.push(
                <Col xs={12} lg={6} className="no-gutters p-0">
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
                <div className="PlayerView">
                    <Container fluid>
                        <Row className="player-header" style={{ backgroundColor: this.state.team.color.replace("0.95", "0.85") }}>
                            <Col xs={6} sm={5} className="player-headshot-header">
                                <Image src={this.getPlayerHeadshot(this.state.player.pid)} className="player-headshot mx-auto" />
                            </Col>
                            <Col xs={6} sm={7} className="d-flex align-items-center pl-0 pl-sm-5">
                                <Row className="align-items-center">
                                    <span>
                                        <h1>{this.state.player.name + "\n"}</h1>
                                        <h5>{this.state.team.name.toUpperCase()}</h5>
                                        <h6>{this.state.player.position} • {this.state.player.height} • {this.state.player.weight}</h6>
                                    </span>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Container fluid>
                        <Row className="p-2" style={{ backgroundColor: this.state.team.color.replace("0.95", "0.05") }}>
                            {this.createGrid()}
                        </Row>
                    </Container>
                </div>
            );
        }
    }
}