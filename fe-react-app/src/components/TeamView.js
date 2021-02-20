import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HighlightCard from './HighlightCard';
import LoadingModal from './LoadingModal';

export default class PlayerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tid: this.props.match.params.tid,
            page: this.props.match.params.page,
            team: {},
            players: [],
            highlights: [],
            isLoading: true
        }
    }

    componentDidMount() {
        const apiURL = `http://localhost:5000/teams/${this.state.tid}/${this.state.page}`;
        fetch(apiURL)
            .then((res) => res.json())
            .then((result) => {
                this.setState({ 
                    team: result.team,
                    players: result.players,
                    highlights: result.highlights,
                    isLoading: false
                });
            });
        console.log(this.state);
    }

    getTeamLogo = (tid) => {
        return `https://cdn.nba.com/logos/nba/${tid}/primary/L/logo.svg`
    }

    getPlayerHeadshot = (pid) => {
        return `https://cdn.nba.com/headshots/nba/latest/1040x760/${pid}.png`;
    }

    createPlayerRow = () => {
        let cols = [];
        for (let i = 0; i < this.state.players.length; i++) {
            cols.push(
                <Col xs={4} sm={2} className="no-gutters d-flex flex-wrap align-items-center px-0 py-2">
                    <Link to={`/players/${this.state.players[i].pid}/1/`}>
                        <Image
                            src={this.getPlayerHeadshot(this.state.players[i].pid)}
                            className="team-player-headshot mx-auto p-1"
                            style={{ /* borderColor: this.team.color, border: "2px solid", */ backgroundColor: "#ffffff" }}
                            roundedCircle
                        />
                    </Link>
                </Col>
            )
        }
        return cols;
    }

    createHighlightGrid = () => {
        let cols = [];
        for (let i = 0; i < this.state.highlights.length; i++) {
            cols.push(
                <Col xs={12} lg={6} className="no-gutters p-0">
                    <HighlightCard highlight={this.state.highlights[i]} className="p-1" />
                </Col>
            )
        }
        return cols;
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
                <div className="TeamView">
                    <Container fluid>
                        <Row className="team-header" style={{ backgroundColor: this.state.team.color.replace("0.95", "0.8") }}>
                            <Col xs={3} sm={5} className="d-flex flex-wrap align-items-center">
                                <Image src={this.getTeamLogo(this.state.team.tid)} className="team-logo d-block mx-auto my-auto" />
                            </Col>
                            <Col xs={9} sm={7} className="d-flex align-items-center">
                                <Row className="align-items-center">
                                    <span>
                                        <h1>{this.state.team.name + "\n"}</h1>
                                        <h5>{this.state.team.conference + " Conference"}</h5>
                                    </span>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Container style={{ backgroundColor: this.state.team.color.replace("0.95", "0.05") }} fluid>
                        <Row className="p-2">
                            {this.createPlayerRow()}
                        </Row>
                        <hr className="my-0" />
                        <Row className="p-2">
                            {this.createHighlightGrid()}
                        </Row>
                    </Container>
                </div>
            );
        }
    }
}
