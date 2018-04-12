
<h2  align="center">React Native hGraph</h2>

<p  align="center">

<a  href="https://humanapi.co">

<img  width="400"  src="https://firebasestorage.googleapis.com/v0/b/health-score-6740b.appspot.com/o/development%2Fresources%2Fimages%2FSimulator%20Screen%20Shot%20-%20iPhone%208%20Plus%20-%202018-04-07%20at%2022.07.28.png?alt=media&token=48afa9ee-7256-4623-b335-6d1b6a257341"><br/>

</a>

  

</p>

  

<p  align="center">

<a  href="https://www.npmjs.com/package/react-native-hgraph"><img  src="https://img.shields.io/npm/dw/react-native-hgraph.svg?style=flat-square"  alt="NPM downloads"></a>

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

$ react-native link

```

  

### iOS installation

If RNSVG.xcodeproj is nod added to the iOS project as a Library then follow the steps bellow:

  

1. Add RNSVG.xcodeproj from *\<React Native Project\>/node_modules/react-native-svg/iOS/* to your project

2. Link the libRNSVG.a library in the **Linked Frameworks and Libraries** in your Target -> General -> Linked Frameworks and Libraries

  

### Common props:

  

Name | Default | Description
----------------|------------|--------------
data | 'none' | The data to be displayed: 
score | 'none' | The health score
color | "#36d391" | 
pathColor | "#d2d2d2" | 
width | 600 | 
height | 600 | 
margin | { top:  70, right:  100, bottom:  70, left:  100 } | 
thresholdMin | .25 | 
thresholdMax | .75 | 
donutHoleFactor| .45 | 
healthyRangeFillColor | '#afedd3' | 
fontSize| 16 | 
fontColor | '#B6B6B6' | 
showAxisLabel | true | 
axisLabelOffset | 12 | 
axisLabelWrapWidth | 80 |
areaOpacity | 0.45 | 
pointRadius | 4 | 
pointLabelOffset | 8 | 
pointLabelWrapWidth | null | 
showScore | true | 
scoreFontSize | 120 | 
scoreFontColor | '#3ED295' | 
zoomFactor | 2.25 | 
zoomTransitionTime | 750 | 
 
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