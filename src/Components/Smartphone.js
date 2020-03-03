import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './Smartphones.css'

export default class Smartphone extends React.Component {

    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div>
              <Card>
                <CardContent className="image">
                    <img src={this.props.image}/>
                </CardContent>
              </Card>
              
            </div>
          )
    }
  
}