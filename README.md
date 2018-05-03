<h2  align="center">React Native hGraph</h2>
<p  align="center">
<a  href="http://hgraph.org">
<img  width="400"  src="https://firebasestorage.googleapis.com/v0/b/health-score-6740b.appspot.com/o/development%2Fresources%2Fimages%2FSimulator%20Screen%20Shot%20-%20iPhone%208%20Plus%20-%202018-04-07%20at%2022.07.28.png?alt=media&token=48afa9ee-7256-4623-b335-6d1b6a257341"><br/></a>
</p>
<p  align="center">
<a  href="https://www.npmjs.com/package/react-native-hgraph"><img  src="https://img.shields.io/npm/dt/react-native-hgraph.svg?style=flat-square"  alt="NPM downloads"></a>
<a  href="https://www.npmjs.com/package/react-native-hgraph"><img  src="https://img.shields.io/npm/v/react-native-hgraph.svg?style=flat-square"  alt="NPM version"></a>
<a  href="/LICENSE"><img  src="https://img.shields.io/aur/license/yaourt.svg?style=flat-square"  alt="License"></a>
<a  href="https://twitter.com/citizenhealth"><img  src="https://img.shields.io/twitter/follow/CitizenHealthio.svg?style=social&logo=twitter&label=Follow"  alt="Follow on Twitter"></a>
</p>

## Introduction

  

This is a React Native native implementation of the [hGraph](http://hgraph.org/) library. hGraph is a visual representation of a patient's health status, designed to increase awareness of the individual's factors that can affect one's overall health.

  

# react-native-hgraph

  

## Getting started

  

```

$ npm install react-native-hgraph --save

$ react-native link react-native-hgraph

```

You will still need to manually add the SVG package manually. Please follow the steps below.

### iOS Manual Installation

Follow the steps bellow:

  

1. Add RNSVG.xcodeproj from *\<React Native Project\>/node_modules/react-native-svg/iOS/* to your project

2. Link the libRNSVG.a library in the **Linked Frameworks and Libraries** in your Target -> General -> Linked Frameworks and Libraries

### Android Manual Installation

Follow the steps bellow:

 1. Import the react-native-hgraph module:
Add the following lines to your ***settings.gradle*** file:

```
include ':react-native-svg'  
project(':react-native-svg').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-svg/android')  
include ':react-native-hgraph'  
project(':react-native-hgraph').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-hgraph/android')
```

 2. Add the compile line in your app gradle file:
```
implementation project(':react-native-svg')  
implementation project(':react-native-hgraph')
```
 3. Import *RNReactNativeHgraphPackage* and *SvgPackage* in the  ***MainApplication.java*** file:
```
import io.citizenhealth.RNReactNativeHgraphPackage;  
import com.horcrux.svg.SvgPackage;
```
and add the **new SvgPackage()** and **new RNReactNativeHgraphPackage()**  in your ***getPackages()*** function in ***MainApplication.java***
```
protected List<ReactPackage> getPackages() {  
  return Arrays.<ReactPackage>asList(  
      new MainReactPackage(),  
       new SvgPackage(),  
       new RNReactNativeHgraphPackage()  
  );  
}
 ```

### Common props:

  
| Prop Name | Type | Is Required | Description | Default |
| --------- | ---- | ----------- | ----------- | ------- |
| data | array | true | An array of objects representing the metrics to display in hGraph (see [below](#metrics)) | N/A |
| score | number | false | The overall score to display in the center of hGraph | N/A |
| width | number | false | The width in pixels hGraph should render at. | 600 |
| height | number | false | The height in pixels hGraph should render at. | 600 |
| margin | object | false | An object representing the values for margins around hGraph. | `{ top: 70, right: 100, bottom: 70, left: 100 }` |
| thresholdMin | number | false | A number value between 0 and 1 (percentage), determining the position the lower threshold of the healthy range renders at. | .25 |
| thresholdMax | number | false | A number value between 0 and 1 (percentage), determining the position the upper threshold of the healthy range renders at. | .75 |
| donutHoleFactor | number | false | A number value between 0 and 1 (percentage), determining the amount of hGraph's radius that should be cut out forming the hole in the center of the graph. | .4 |
| pathColor | string (hex color code) | false | The color of the polygon shape.| "#d2d2d2" | 
| color | string (hex color code) | false | The color of the points and polygon shape. | '#616363' |
| healthyRangeFillColor | string (hex color code) | false | The color of the healthy range band. | '#98bd8e' |
| fontSize | number | false | The size (in pixels) of the font for the labels. | 16 |
| fontColor | string (hex color code) | false | The color of the labels. | '#000' |
| showAxisLabel | boolean | false | Whether or not axis labels should display around hGraph. | true |
| axisLabelWrapWidth | number | false | The width (in pixels) that the labels should wrap text at. | 80 (Note: use `null` for no wrapping) |
| axisLabelOffset | number | false | The distance (in pixels) that axis labels should be offset from the outer bounds of hGraph's 'absolute max' radius. | 12 |
| areaOpacity | number | false | The opacity of the polygon shape. | 0.25 |
| pointRadius | number | false | The radius (in pixels) of the points for metric values. | 10 |
| pointLabelWrapWidth | number | false | The width (in pixels) that the point labels should wrap text at. | null (no wrapping) |
| pointLabelOffset | number | false | The distance (in pixels) that point labels should be offset from the point. | 8 |
| hitboxRadius | number | false | The radius (in pixels) of the point hitboxes. (hGraph overlays a transparent hitbox over each point which can help users accurately click/touch points, particularly on mobile devices.) | Defaults to `props.pointRadius` size.
| showScore | boolean | false | Whether or not to display the overall score in the middle of hGraph. | true |
| scoreFontSize | number | false | The size (in pixels) of the font for the overall hGraph score | 120 |
| scoreFontColor | string (hex color code) | false | The color of the hGraph score. | '#000' |
| zoomFactor | number | false | The multiplier factor hGraph should zoom in. | 2.25 |
| zoomTransitionTime | number | false | The amount of time (in milliseconds) the zooming animation should take. | 750 |
| zoomOnPointClick | boolean | false | Configure if hGraph should zoom in/focus on a clicked point and display child points in the graph. | true |
| onPointClick | function | false | Callback function called when a point is clicked. Function is passed 2 arguments: the data object corresponding to the point clicked, and the event. | N/A |
Name | Default | Type | Description
----------------|------------|--------------|--------------

## Usage
```javascript
import  HGraph, {
	hGraphConvert,
	calculateHealthScore
} from  'react-native-hgraph';
...
const  totalCholesterolValue  = (1-0)*Math.random();
const  ldlValue  = (300-0)*Math.random();
const  hdlValue  = (150-0)*Math.random();
const  triglyceridesValue  = (300-0)*Math.random();
const  bloodPressureSystolicValue  = (230-50)*Math.random();
const  bloodPressureDiastolicValue  = (140-35)*Math.random();
const  alcoholUseValue  = (20-0)*Math.random();
const  nicotineUseValue  = (20-0)*Math.random();
const  painLevelValue  = (10-0)*Math.random();
const  waistCircumferenceValue  = (200-0)*Math.random();
const  weightValue  = (400-50)*Math.random();
const  exerciseValue  = (60-0)*Math.random();
const  sleepValue  = (18-0)*Math.random();
const  happinessValue  = (10-0)*Math.random();
const  glucoseValue  = (160-0)*Math.random();
const  otherValue  = (1-0)*Math.random();
const  healthData  = [
hGraphConvert('male', 'totalCholesterol',
{
	id :  'totalCholesterol',
	"value" :  totalCholesterolValue
}),
hGraphConvert('male', 'ldl',
{
	id :  'ldl',
	"value" :  ldlValue
}),
hGraphConvert('male', 'hdl',
{
	id :  'hdl',
	"value" :  hdlValue
}),
hGraphConvert('male', 'triglycerides',
{
	id :  'triglycerides',
	"value" :  triglyceridesValue
}),
hGraphConvert('male', 'bloodPressureSystolic',
{
	id :  'bloodPressureSystolic',
	"value" :  bloodPressureSystolicValue
}),
hGraphConvert('male', 'bloodPressureDiastolic',
{
	id :  'bloodPressureDiastolic',
	"value" :  bloodPressureDiastolicValue
}),
hGraphConvert('male', 'alcoholUse',
{
	id :  'alcoholUse',
	"value" :  alcoholUseValue
}),
hGraphConvert('male', 'nicotineUse',
{
	id :  'nicotineUse',
	"value" :  nicotineUseValue
}),
hGraphConvert('male', 'painLevel',
{
	id :  'painLevel',
	"value" :  painLevelValue
}),
hGraphConvert('male', 'waistCircumference',
{
	id :  'waistCircumference',
	"value" :  waistCircumferenceValue
}),
hGraphConvert('male', 'weight',
{
	id :  'weight',
	"value" :  weightValue
}),
hGraphConvert('male', 'exercise',
{
	id :  'exercise',
	"value" :  exerciseValue
}),
hGraphConvert('male', 'sleep',
{
	id :  'sleep',
	"value" :  sleepValue
}),
hGraphConvert('male', 'happiness',
{
	id :  'happiness',
	"value" :  happinessValue
}),
hGraphConvert('male', 'glucose',
{
	id :  'glucose',
	"value" :  glucoseValue
}),
hGraphConvert('male', 'other',
{
	id :  'other',
	"value" :  otherValue
}),
]
const  healthScore  =  Math.floor(calculateHealthScore(healthData));
...
<HGraph
	width= {200}
	height= {200}
	score={98}
	margin={
		{top:  50,
		right:  100,
		bottom:  50,
		left:  100}}
	showAxisLabel={true}
	scoreFontSize= {50}
	data= {}
/>
```