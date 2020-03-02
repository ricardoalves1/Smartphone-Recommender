import React from 'react';
import Smartphone from './Smartphone';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import './Smartphones.css';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

export default class Smartphones extends React.Component {

    constructor(props) {
        super(props);
        
        this.state = {
            activeStep: 0,
            maxSteps: this.props.phones.length
        };
        
        this.handleStepChange = this.handleStepChange.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.theme = this.theme.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

    theme() {
        return useTheme();
    }

    handleStepChange(step) {
        if(Number.isInteger(step))
            this.setState({activeStep: step});
    };

    handleNext(){
        this.setState({activeStep: this.state.activeStep + 1});;
    };

    handleBack(){
        this.setState({activeStep: this.state.activeStep - 1});;
    };

    render() {

        let label, buttons
        if(this.props.phones.length != 0) {
            label = <Paper square elevation={3} className="header">
                        <Typography>{this.props.phones[this.state.activeStep].Name}</Typography>
                    </Paper>
            
            buttons = <MobileStepper
                        className="header"
                        steps={this.state.maxSteps}
                        position="static"
                        variant="text"
                        activeStep={this.state.activeStep}
                        nextButton={
                            <Button size="small" onClick={this.handleNext} disabled={this.state.activeStep === this.state.maxSteps - 1}>
                                Next
                                {this.theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                            </Button>
                        }
                        backButton={
                            <Button size="small" onClick={this.handleBack} disabled={this.state.activeStep === 0}>
                                {this.theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                                Back
                            </Button>
                        }
                    />
        } else {
            label = <p/>
            buttons = <p/>
        }

        return (

            <div className="root">
                {label}

                <AutoPlaySwipeableViews
                    axis={this.theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={this.state.activeStep}
                    onChangeIndex={this.handleStepChange}
                    enableMouseEvents
                >
                    {this.props.phones.map((phone, index) => (
                        <div key={index}>
                            {Math.abs(this.state.activeStep - index) <= 2 ? (
                                <Smartphone
                                    key={index}
                                    name={phone.Name}
                                    image={phone.ImageUrl}
                                    screen={phone.Screen_size}
                                    storage={phone.Storage_details}
                                    battery={phone.Battery_details}
                                    camera={phone.Camera_details}
                                />
                            ) : null}
                        </div>
                    ))}

                </AutoPlaySwipeableViews>

                {buttons}

            </div>

        );
    }

}