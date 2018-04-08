
  <h2 align="center">React Native hGraph</h2>
<p align="center">
  <a href="https://humanapi.co">
    <img width="400" src="https://firebasestorage.googleapis.com/v0/b/health-score-6740b.appspot.com/o/development%2Fresources%2Fimages%2FSimulator%20Screen%20Shot%20-%20iPhone%208%20Plus%20-%202018-04-07%20at%2022.07.28.png?alt=media&token=48afa9ee-7256-4623-b335-6d1b6a257341"><br/>
  </a>

</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-human-api"><img src="https://img.shields.io/npm/dt/react-native-human-api.svg?style=flat-square" alt="NPM downloads"></a>
  <a href="https://www.npmjs.com/package/react-native-human-api"><img src="https://img.shields.io/npm/v/react-native-human-api.svg?style=flat-square" alt="NPM version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/aur/license/yaourt.svg?style=flat-square" alt="License"></a>
  <a href="https://twitter.com/citizenhealth"><img src="https://img.shields.io/twitter/follow/CitizenHealthio.svg?style=social&logo=twitter&label=Follow" alt="Follow on Twitter"></a>
</p>

## Introduction

This is a React Native native implementation of the  [hGraph](http://hgraph.org/) library. hGraph is a visual representation of a patient's health status, designed to increase awareness of the individual's factors that can affect one's overall health.

# react-native-hgraph

## Getting started

`$ npm install react-native-hgraph --save`


## Usage
```javascript
import  HGraph, { 
					hGraphConvert, 
					calculateHealthScore 
				} from  'react-native-hgraph';
...
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
```

