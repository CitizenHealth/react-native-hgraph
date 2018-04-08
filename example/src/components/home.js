import React, { Component } from 'react';
import { connect } from 'react-redux';

//import HGraph from 'react-native-hgraph';
import HGraph, { hGraphConvert, calculateHealthScore }  from 'react-native-hgraph';
import { scale } from "react-native-size-matters";
import { setData, setScore } from '../actions';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

class Home extends Component {

  refreshData() {
      const totalCholesterolValue = (1-0)*Math.random();
      const ldlValue = (300-0)*Math.random();
      const hdlValue = (150-0)*Math.random();
      const triglyceridesValue = (300-0)*Math.random();
      const bloodPressureSystolicValue = (230-50)*Math.random();
      const bloodPressureDiastolicValue = (140-35)*Math.random();
      const alcoholUseValue = (20-0)*Math.random();
      const nicotineUseValue = (20-0)*Math.random();
      const painLevelValue = (10-0)*Math.random();
      const waistCircumferenceValue = (200-0)*Math.random();
      const weightValue = (400-50)*Math.random();
      const exerciseValue = (60-0)*Math.random();
      const sleepValue = (18-0)*Math.random();
      const happinessValue = (10-0)*Math.random();
      const glucoseValue = (160-0)*Math.random();
      const otherValue = (1-0)*Math.random();
      const healthData = [
        hGraphConvert('male', 'totalCholesterol',
        {
            id        : 'totalCholesterol',
            "value"     : totalCholesterolValue
        }),
        hGraphConvert('male', 'ldl',
        {
            id        : 'ldl',
            "value"     : ldlValue
        }),
        hGraphConvert('male', 'hdl',
        {
            id        : 'hdl',
            "value"     : hdlValue
        }),
        hGraphConvert('male', 'triglycerides',
        {
            id        : 'triglycerides',
            "value"     : triglyceridesValue
        }),
        hGraphConvert('male', 'bloodPressureSystolic',
        {
            id        : 'bloodPressureSystolic',
            "value"     : bloodPressureSystolicValue
        }),
        hGraphConvert('male', 'bloodPressureDiastolic',
        {
            id        : 'bloodPressureDiastolic',
            "value"     : bloodPressureDiastolicValue
        }),
        hGraphConvert('male', 'alcoholUse',
        {
            id        : 'alcoholUse',
            "value"     : alcoholUseValue
        }),
        hGraphConvert('male', 'nicotineUse',
        {
            id        : 'nicotineUse',
            "value"     : nicotineUseValue
        }),
        hGraphConvert('male', 'painLevel',
        {
            id        : 'painLevel',
            "value"     : painLevelValue
        }),
        hGraphConvert('male', 'waistCircumference',
        {
            id        : 'waistCircumference',
            "value"     : waistCircumferenceValue
        }),
        hGraphConvert('male', 'weight',
        {
            id        : 'weight',
            "value"     : weightValue
        }),
        hGraphConvert('male', 'exercise',
        {
            id        : 'exercise',
            "value"     : exerciseValue
        }),
        hGraphConvert('male', 'sleep',
        {
            id        : 'sleep',
            "value"     : sleepValue
        }),
        hGraphConvert('male', 'happiness',
        {
            id        : 'happiness',
            "value"     : happinessValue
        }),
        hGraphConvert('male', 'glucose',
        {
            id        : 'glucose',
            "value"     : glucoseValue
        }),
        hGraphConvert('male', 'other',
        {
            id        : 'other',
            "value"     : otherValue
        }),
      ]

      const healthScore = calculateHealthScore(healthData);
      this.props.setData(healthData);
      this.props.setScore(healthScore);
  }

  render() {
    const {
        buttonContainerStyle,
        buttonTextStyle
    } = styles;

    const obj = hGraphConvert('male', 'totalCholesterol',
    {
      "LDL"       : 3,
      "value"     : 251
    });
    
    console.log(`Converted LDL: ${obj}`)

    return (
        <View style={styles.container}>
          <HGraph
            width= {200}
            height= {200}
            score={this.props.score}
            margin={
              {top: 50,
              right: 100, 
              bottom: 50, 
              left: 100}}
            showAxisLabel={true}
            scoreFontSize= {50} 
            data= {this.props.data} 
            />
            <TouchableOpacity
                style = {buttonContainerStyle}
                onPress= {() => {this.refreshData()}}
            >
                <Text style= {buttonTextStyle}>
                    REFRESH DATA
                </Text>
            </TouchableOpacity> 
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  buttonContainerStyle: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#3ad48e',
    marginBottom: 20
  },
  buttonTextStyle: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 5,
    ...Platform.select({
        ios: { fontFamily: "Arial", },
        android: { fontFamily: "Roboto" }
    })
  }   
});

const mapStateToProp = state => {
  const {data, score} = state.data;

  return {data, score};
}

export default connect(mapStateToProp, {setData, setScore})(Home);