import React, { Component } from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import { arc } from 'd3-shape';
import { format } from 'd3-format';
import { scaleLinear } from 'd3-scale';
import { easeExp, easeElastic } from 'd3-ease';
import Animate from 'react-move/Animate';
import NodeGroup from 'react-move/NodeGroup';
import Svg,{
  Circle,
  Ellipse,
  G,
  LinearGradient,
  RadialGradient,
  Line,
  Path,
  Text,
  Polygon,
  Polyline,
  Rect,
  Symbol,
  Use,
  Defs,
  Stop
} from 'react-native-svg';

class HGraph extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      healthyMin: PropTypes.number.isRequired,
      healthyMax: PropTypes.number.isRequired,
      absoluteMin: PropTypes.number.isRequired,
      absoluteMax: PropTypes.number.isRequired,
      unitLabel: PropTypes.string.isRequired,
      children: PropTypes.array
    })).isRequired,
    score: PropTypes.number,
    color: PropTypes.string,
    pathColor: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number
    }),
    thresholdMin: PropTypes.number,
    thresholdMax: PropTypes.number,
    donutHoleFactor: PropTypes.number,
    healthyRangeFillColor: PropTypes.string,
    fontSize: PropTypes.number,
    fontColor: PropTypes.string,
    showAxisLabel: PropTypes.bool,
    axisLabelOffset: PropTypes.number,
    axisLabelWrapWidth: PropTypes.number,
    areaOpacity: PropTypes.number,
    pointRadius: PropTypes.number,
    pointLabelOffset: PropTypes.number,
    pointLabelWrapWidth: PropTypes.number,
    showScore: PropTypes.bool,
    scoreFontSize: PropTypes.number,
    scoreFontColor: PropTypes.string,
    zoomFactor: PropTypes.number,
    zoomTransitionTime: PropTypes.number
  };

  static defaultProps = {
    width: 600,
    height: 600,
    color: '#36d391',
    pathColor: '#d2d2d2',
    margin: { top: 70, right: 100, bottom: 70, left: 100 },
    thresholdMin: .25,
    thresholdMax: .75,
    donutHoleFactor: .45,
    healthyRangeFillColor: '#afedd3',
    fontSize: 16,
    fontColor: '#B6B6B6',
    showAxisLabel: true,
    axisLabelOffset: 12,
    axisLabelWrapWidth: 80,
    areaOpacity: 0.45,
    pointRadius: 4,
    pointLabelOffset: 8,
    pointLabelWrapWidth: null,
    showScore: true,
    scoreFontSize: 120,
    scoreFontColor: '#3ED295',
    zoomFactor: 2.25,
    zoomTransitionTime: 750
  }

  constructor(props) {
    super(props);

    this.absoluteMin = 0;
    this.absoluteMax = 1;

    this.setGlobalConfig(props, false);
    const points = this.assemblePoints(props.data);

    this.state = {
      data: props.data,
      activePointId: '',
      zoomed: false,
      zoomCoords: [0, 0],
      zoomFactor: 1,
      points: points,
      path: this.assemblePath(points),
      suppressTransition: true,
      fontSize: props.fontSize
    };

    this.Format = format('.0%');
  }

  componentWillReceiveProps(nextProps) {
    // TODO: There may be a way to refine this a bit to occur less often
    if (nextProps !== this.props) {
      this.setGlobalConfig(nextProps);
    }
  }

  setGlobalConfig = (props, shouldSetState = true) => {
    this.labelConfigurationHeightCutoff = props.height / 6;
    this.labelConfigurationWidthCutoff = props.width * .1;
    this.radius = Math.min((props.width / 2), (props.height / 2));
    this.rangeBottom = this.radius * this.props.donutHoleFactor;
    this.angleSlice = (Math.PI * 2) / props.data.length;

    this.scaleRadial = scaleLinear()
      .domain([this.absoluteMin, this.absoluteMax])
      .range([this.rangeBottom, this.radius]);

    if (shouldSetState) {
      const points = this.assemblePoints(props.data);

      this.setState({
        data: props.data,
        points,
        path: this.assemblePath(points)
      });
    }
  }

  convertValueToHgraphPercentage = (valueObject) => {
    const { value, healthyMin, healthyMax, absoluteMin, absoluteMax } = valueObject;
    let scale;

    // Do some error checking
    // TODO: Need to provide more info on which object etc. for user here
    if (absoluteMin > absoluteMax) {
      throw "absoluteMin is higher than absoluteMax."
    } else if (
      healthyMin < absoluteMin
      || healthyMax < absoluteMin
      || healthyMax > absoluteMax
      || healthyMin > absoluteMax) {
      throw "Healthy range extends outside of absolute range."
    }

    if (healthyMin === healthyMax && value === healthyMax) {
      // Possible rare case where only healthy "range" is a single value
      // and the current value is healthy
      return this.props.thresholdMax - this.props.thresholdMin;
    }
    else if (value < healthyMin) {
      scale = scaleLinear()
        .domain([absoluteMin, healthyMin])
        .range([this.absoluteMin, this.props.thresholdMin]);
    } else if (value > healthyMax) {
      scale = scaleLinear()
        .domain([healthyMax, absoluteMax])
        .range([this.props.thresholdMax, this.absoluteMax]);
    } else {
      scale = scaleLinear()
        .domain([healthyMin, healthyMax])
        .range([this.props.thresholdMin, this.props.thresholdMax]);
    }
    return scale(value);
  }

  handleSvgClick = (e) => {
    if (this.state.zoomed) {
      this.zoomOut();
    }
  }

  handlePointClick = (d) => (e) => {
    e.stopPropagation();

    const cos = Math.cos(d.angle - Math.PI / 2);
    const sin = Math.sin(d.angle - Math.PI / 2);

    const cx = this.scaleRadial(.5) * cos;
    const cy = this.scaleRadial(.5) * sin;

    if (this.state.zoomed && d.key === this.state.activePointId) {
      this.zoomOut();
    } else {
      if (!this.state.zoomed) {
        this.addChildren();
      }
      this.setState({
        activePointId: d.key,
        zoomed: true,
        zoomCoords: [cx, cy],
        zoomFactor: this.props.zoomFactor
      });
    }
  }

  zoomOut = () => {
    this.removeChildren();
    this.setState({
      activePointId: '',
      zoomed: false,
      zoomCoords: [0, 0],
      zoomFactor: 1
    });
  }

  buildPoint = (d, percentageFromValue) => {
    const cos = Math.cos(d.angle - Math.PI / 2);
    const sin = Math.sin(d.angle - Math.PI / 2);

    const isAboveMidPoint = percentageFromValue > (this.props.thresholdMax - this.props.thresholdMin);
    const isUnhealthilyHigh = percentageFromValue > this.props.thresholdMax;

    const cx = this.scaleRadial(percentageFromValue) * cos;
    const cy = this.scaleRadial(percentageFromValue) * sin;

    const labelShouldRenderInside = isUnhealthilyHigh || (isAboveMidPoint && cy < this.labelConfigurationHeightCutoff && cy > -this.labelConfigurationHeightCutoff);

    const labelOffset = labelShouldRenderInside ? -this.props.pointLabelOffset : this.props.pointLabelOffset;
    const labelPosition = parseFloat(percentageFromValue);
    const activeCx = (this.scaleRadial(labelPosition) + labelOffset) * cos;
    const activeCy = (this.scaleRadial(labelPosition) + labelOffset) * sin;

    const textAnchor =
      labelShouldRenderInside && cx < this.labelConfigurationWidthCutoff && cx > -this.labelConfigurationWidthCutoff ? 'middle'
        : labelShouldRenderInside && cx < -this.labelConfigurationWidthCutoff ? 'start'
        : labelShouldRenderInside && cx > this.labelConfigurationWidthCutoff ? 'end'
        : cx < -this.labelConfigurationWidthCutoff ? 'end'
        : cx > this.labelConfigurationWidthCutoff ? 'start'
        : 'middle';

    const verticalAnchor =
      labelShouldRenderInside && cy < this.labelConfigurationHeightCutoff ? 'start'
        : labelShouldRenderInside && cy > this.labelConfigurationHeightCutoff ? 'end'
        : labelShouldRenderInside ? 'middle'
        : cy < this.labelConfigurationHeightCutoff ? 'end'
        : cy > this.labelConfigurationHeightCutoff ? 'start'
        : 'middle';

      return {
        key: d.id,
        value: parseFloat(Math.round(d.value * 100) / 100).toFixed(2),
        angle: d.angle,
        cx: d.cx || cx,
        cy: d.cy || cy,
        activeCx,
        activeCy,
        color: this.thresholdColor(percentageFromValue, this.props.color),
        fontColor: this.thresholdColor(percentageFromValue, this.props.fontColor),
        unitLabel: d.unitLabel,
        textAnchor,
        verticalAnchor,
        isChild: d.isChild || false,
        children: d.children || null
      };
  }

  assemblePath = (points) => {
    let fillString = '';

    points.map((p, i) => {
      fillString += (i === 0 ? 'M ' : 'L ') + p.cx + ' ' + p.cy + ' ';
    });

    return fillString;
  }

  assemblePoints = (data, addingChildren = false) => {
    const points = data.map((d, i) => {
      const percentageFromValue = this.convertValueToHgraphPercentage(d);
      d.angle = addingChildren && d.angle ? d.angle : this.angleSlice * i;

      return this.buildPoint(d, percentageFromValue);
    });

    return [].concat.apply([], points);
  }

  assembleIntrimChildPointsForPoint = (point, dataIndex, distance, vector, angleSliceSubdivision) => {
    return point.children.map((c, i) => {
      const copy = Object.assign({}, c);
      const frac = 1 / angleSliceSubdivision;
      copy.cx = point.cx + (distance * (frac * (i + 1))) * vector[0];
      copy.cy = point.cy + (distance * (frac * (i + 1))) * vector[1];
      copy.isChild = true;
      copy.angle = (this.angleSlice * dataIndex) + ((this.angleSlice / angleSliceSubdivision) * (i + 1));
      return copy;
    });
  }

  getDistanceAndVectorBetweenPoints(point, siblingPoint) {
    const vector = [(siblingPoint.cx - point.cx), (siblingPoint.cy - point.cy)];
    const distance = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
    const vectorNormalized = [vector[0] / distance, vector[1] / distance];

    return {
      distance,
      vector: vectorNormalized
    }
  }

  addChildren = () => {
    // Copy the state data
    let finalData = this.state.data.map(d => d);
    let intrimData = this.state.data.map(d => d);
    let groupsInserted = 0;

    // For any point with children, build and add the child points
    this.state.data.forEach((data, i) => {
      if (data.children && data.children.length) {
        const dataIndex = i;
        const spliceIndex = dataIndex + 1 + groupsInserted;
        const point = this.state.points[i];
        const siblingPoint = this.state.points[dataIndex + 1];
        const angleSliceSubdivision = point.children.length + 1;
        const { distance, vector } = this.getDistanceAndVectorBetweenPoints(point, siblingPoint);
        const pointsIntrimChildren = this.assembleIntrimChildPointsForPoint(point, dataIndex, distance, vector, angleSliceSubdivision);

        point.children.map((c, i) => {
          c.angle = (this.angleSlice * dataIndex) + ((this.angleSlice / angleSliceSubdivision) * (i + 1));
          c.isChild = true;
          return c;
        });

        intrimData.splice(spliceIndex, 0, pointsIntrimChildren);
        finalData.splice(spliceIndex, 0, point.children);

        groupsInserted += 1;
      }
    });

    // Flatten for the arrays added in
    intrimData = [].concat.apply([], intrimData);
    finalData = [].concat.apply([], finalData);

    const intrimPoints = this.assemblePoints(intrimData, true);
    const intrimPath = this.assemblePath(intrimPoints);
    const finalPoints = this.assemblePoints(finalData, true);

    this.setState({
      data: intrimData,
      points: intrimPoints,
      path: intrimPath,
      returnIntrimData: intrimData,
      returnIntrimPoints: intrimPoints,
      returnIntrimPath: intrimPath,
      suppressTransition: true
    }, () => {
      this.setState({
        data: finalData,
        points: finalPoints,
        path: this.assemblePath(finalPoints),
        suppressTransition: false
      });
    });
  }

  removeChildren = () => {
    const finalData = this.state.data.filter(d => !d.isChild);
    const finalPoints = this.assemblePoints(finalData);
    const finalPath = this.assemblePath(finalPoints);

    if (this.state.returnIntrimData) {
      this.setState({
        data: this.state.returnIntrimData,
        points: this.state.returnIntrimPoints,
        path: this.state.returnIntrimPath,
        suppressTransition: false,
      }, () => {
        setTimeout(() => {
          this.setState({
            data: finalData,
            points: finalPoints,
            path: finalPath,
            returnIntrimData: null,
            returnIntrimPoints: null,
            returnIntrimPath: null,
            suppressTransition: true
          });
        }, this.props.zoomTransitionTime + 50);
      });
    } else {
      this.setState({
        data: finalData,
        points: finalPoints,
        path: finalPath,
        suppressTransition: true
      });
    }
  }

  thresholdColor = (value, color) => {
    return (value < this.props.thresholdMin || value > this.props.thresholdMax) ? '#df6053' : color;
  }

  renderThreshold = () => {
    const tau = 2 * Math.PI;
    const healthyArc = arc()
      .outerRadius(this.scaleRadial(this.props.thresholdMax))
      .innerRadius(this.scaleRadial(this.props.thresholdMin))
      .startAngle(0)
      .endAngle(tau);
    // NOTE: totalArc just here for dev purposes for now
    const totalArc = arc()
      .outerRadius(this.scaleRadial(0))
      .innerRadius(this.scaleRadial(1))
      .startAngle(0)
      .endAngle(tau);
    return (
      <G>
        { /* NOTE: totalArc just here for dev purposes for now */ }
        {/* <Path
          d={ totalArc() }
          fill={'#000' }
          fillOpacity=".05">
        </Path> */}
        <Path
          d={ healthyArc() }
          fill={ this.props.healthyRangeFillColor }
          fillOpacity="1">
        </Path>
      </G>
    )
  }

  renderAxisLabels = (fontSize) => {
    return (
      <G>
        {this.state.data.map((d, i) => {
          const x = (this.scaleRadial(this.absoluteMax) + this.props.axisLabelOffset) * Math.cos(d.angle - Math.PI / 2);
          const y = (this.scaleRadial(this.absoluteMax) + this.props.axisLabelOffset) * Math.sin(d.angle - Math.PI / 2);

          return (
            <G key={ d.id }>
              <Text
                x={ x }
                y={ y }
                fontSize={ fontSize }
                verticalAnchor={ y > 100 ? "start" : y < 100 ? "end" : "middle" }
                textAnchor={ x > 10 ? "start" : x < -10 ? "end" : "middle" }
                width={ this.props.axisLabelWrapWidth }
                fill={ this.props.fontColor }>
                { d.label }
              </Text>
            </G>
          )
        })}
      </G>
    )
  }

  renderAxes = (fontSize) => {
    return (
      <G>
        { this.renderThreshold() }
        { this.props.showAxisLabel ? this.renderAxisLabels(fontSize) : null }
      </G>
    )
  }

  renderPoints = (points) => {
    return (
      <NodeGroup
        data={ points }
        keyAccessor={ (d) => d.key }
        start={(d, index) => {
          return {
            cx: d.cx,
            cy: d.cy,
            textOpacity: 0,
            r: d.isChild ? 0 : this.props.pointRadius / this.state.zoomFactor,
            opacity: d.isChild ? 0 : 1
          }
        }}
        enter={(d, index) => {
          return {
            cx: d.cx,
            cy: d.cy,
            textOpacity: 0,
            r: d.isChild ? 0 : this.props.pointRadius / this.state.zoomFactor,
            opacity: d.isChild ? 0 : 1
          }
        }}
        update={(d, index) => {
          const { zoomed } = this.state;
          const radius = this.props.pointRadius / this.state.zoomFactor;
          return [
            {
              cx: this.state.suppressTransition ? d.cx : [d.cx],
              cy: this.state.suppressTransition ? d.cy : [d.cy],
              r: !zoomed && d.isChild ? [1] : d.isChild ? [radius * .75] : [radius],
              opacity: !zoomed && d.isChild ? [0] : [1],
              timing: {
                duration: this.props.zoomTransitionTime,
                ease: d.isChild ? easeElastic : easeExp,
                delay:
                  (zoomed && !d.isChild) ? 0 :
                  (zoomed && d.isChild) ? this.props.zoomTransitionTime :
                  (!zoomed && !d.isChild) ? this.props.zoomTransitionTime :
                  (!zoomed && d.isChild) ? 0 : 0
              }
            },
            {
              textOpacity: this.state.zoomed ? [1] : 0,
              timing: {
                duration: this.props.zoomTransitionTime,
                ease: easeExp,
                delay:
                  (zoomed && !d.isChild) ? 0 :
                  (zoomed && d.isChild) ? this.props.zoomTransitionTime :
                  (!zoomed && !d.isChild) ? this.props.zoomTransitionTime :
                  (!zoomed && d.isChild) ? 0 : 0
              }
            }
          ]
        }}
      >
        {(nodes) => {
          return (
            <G>
              {nodes.map(({ key, data, state }) => {
                return (
                  <G key={ data.key }>
                    <Circle
                      className="polygon__point"
                      r={ state.r }
                      fill={ data.color }
                      cx={ state.cx }
                      cy={ state.cy }
                      opacity={ state.opacity }
                      onPress={ this.handlePointClick(data) }>
                    </Circle>
                    <Text
                      opacity={ state.textOpacity }
                      width={ this.props.pointLabelWrapWidth }
                      x={ data.activeCx }
                      y={ data.activeCy }
//                      fontSize={ globalState.fontSize }
                      fontSize={ this.state.fontSize }
                      verticalAnchor={ data.verticalAnchor }
                      textAnchor={ data.textAnchor }
                      fill={ data.fontColor }
                      style={{ pointerEvents: 'none' }}>
                      { `${data.value} ${data.unitLabel}` }
                    </Text>
                  </G>
                )
              })}
            </G>
          );
        }}
      </NodeGroup>
    )
  }

  // Functions added by Citizen Health
  getScoreColor() {
    if (this.props.score <= 50) {
      return "#F15B58";
    } else if (this.props.score <= 75) {
      return "#DACD0F";
    } else {
      return this.props.scoreFontColor;
    }
  }

  render() {
    return(
      <View>
          <Svg
            className="hgraph"
            width={ this.props.width + this.props.margin.left + this.props.margin.right }
            height={ this.props.height + this.props.margin.top + this.props.margin.bottom }
            onPress={ this.handleSvgClick }>
            <G
              transform={ "translate(" + ((this.props.width / 2) + this.props.margin.left) + "," + ((this.props.height / 2) + this.props.margin.top) + ")" }>
              <Animate
                start={{
                  path: this.state.path,
                  zoomFactor: this.state.zoomFactor,
                  zoomCoords: this.state.zoomCoords,
                  fontSize: this.props.fontSize / this.state.zoomFactor,
                  pointRadius: this.props.pointRadius / this.state.zoomFactor
                }}
                enter={{
                  path: this.state.path,
                  zoomFactor: this.state.zoomFactor,
                  zoomCoords: this.state.zoomCoords,
                  fontSize: this.props.fontSize / this.state.zoomFactor,
                  pointRadius: this.props.pointRadius / this.state.zoomFactor
                }}
                update={[
                  {
                    d: this.state.suppressTransition ? this.state.path : [this.state.path],
                    timing: { duration: this.props.zoomTransitionTime, ease: easeElastic, delay: this.state.zoomed ? this.props.zoomTransitionTime : 0 }
                  },
                  {
                    zoomFactor: [this.state.zoomFactor],
                    zoomCoords: [this.state.zoomCoords],
                    fontSize: [this.props.fontSize / this.state.zoomFactor],
                    pointRadius: [this.props.pointRadius / this.state.zoomFactor],
                    timing: { duration: this.props.zoomTransitionTime, ease: easeExp, delay: this.state.zoomed ? 0 : this.props.zoomTransitionTime }
                  }
                ]}>
                {(globalState) => {
                  return (
                    <G
                      className="zoom-layer"
                      transform={ `scale(${ globalState.zoomFactor }) translate(${ -globalState.zoomCoords[0] || 0 }, ${ -globalState.zoomCoords[1] || 0 })` }>
                      <G className="axis-container">
                        { this.renderAxes(globalState.fontSize) }
                      </G>
                      <G className="path-container">
                        <Path
                          d={this.state.path}
                          fill={ this.props.pathColor }
                          opacity={ this.props.areaOpacity }
                        />
                      </G>
                      <G className="points-container">
                        { this.renderPoints(this.state.points) }
                      </G>
                      <G className="score-container">
                        <Text
                          x="0"
                          y="15"
                          textAnchor="middle"
                          verticalAnchor="middle"
                          fontSize={ this.props.scoreFontSize }
                          fontWeight="bold"
                          fill={ this.getScoreColor() }>
                            { this.props.score }
                        </Text>
                      </G>
                    </G>
                  )
                }}
              </Animate>
            </G>
          </Svg>
      </View>
    )
  }
}

export default HGraph;
