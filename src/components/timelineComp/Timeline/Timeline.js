import React, { Component } from 'react';

import { timelineStore, TODAY_MARKER_REFERENCE } from '../../../store';

import WeekComp from '../WeekComp/WeekComp';
import ClassBarRowComp from '../ClassBarRowComp/ClassBarRowComp';
import ClassTaskRowComp from '../ClassTaskRowComp/ClassTaskRowComp';
import loader from '../../../assets/images/loader.gif';
import Buttons from '../Buttons/Buttons';
import classes from './timeline.css';

export default class Timeline extends Component {
  state = {
    todayMarkerRef: null
  };

  setTodayMarkerRef = ref => {
    this.setState({ todayMarkerRef: ref });
  };

  renderWeekComp = () => {
    if (!this.props.allWeeks) return null;
    const { rowHeight, itemWidth } = this.props;
    return (
      <div className={classes.rowContainer}>
        {this.props.allWeeks.map(week => (
          <WeekComp
            setTodayMarkerRef={this.setTodayMarkerRef}
            scrollingParentRef={this.refs.timelineWrapper}
            key={week}
            week={week}
            rowHeight={rowHeight}
            itemWidth={itemWidth}
          />
        ))}
      </div>
    );
  };

  renderTaskRowComp = () => {
    if (
      !this.props.groups ||
      !this.props.timelineItems ||
      !this.props.allWeeks
    ) {
      return null;
    }
    return this.props.groups.map(group => {
      const items = this.props.timelineItems[group];
      const { itemWidth, rowHeight } = this.props;
      return (
        <div key={items[0].group_name} className={classes.rowContainer}>
          <ClassTaskRowComp
            isTeacher={this.props.isTeacher}
            teachers={this.props.teachers}
            selectedModule={this.props.selectedModule}
            items={items}
            width={itemWidth}
            height={rowHeight}
            allWeeks={this.props.allWeeks}
            itemClickHandler={this.props.itemClickHandler}
            infoSelectedModule={this.props.infoSelectedModule}
          />
        </div>
      );
    });
  };

  observer = mergedData => {
    switch (mergedData.type) {
      case TODAY_MARKER_REFERENCE:
        this.setState({ todayMarkerRef: mergedData.payload.todayMarkerRef });
        break;
      default:
        break;
    }
  };

  handleClickTodayMarker = e => {
    const todayMarker = this.state.todayMarkerRef; // using refs instead of manipulatng DOM
    let leftPos = todayMarker.parentNode.getBoundingClientRect().x;
    leftPos -= window.innerWidth / 2;
    const scrollEl = this.refs.timelineWrapper; // using refs instead of manipulatng DOM
    scrollEl.scrollLeft = leftPos;
  };

  componentWillMount = () => {
    // so that it gets all setState notification from generated by componentDidMount of children elements
    timelineStore.subscribe(this.observer);
  };

  componentDidMount = () => {
    // kick in the process by getting the items and changing the state properties
    // in didMount cause it causes side-effects
    timelineStore.fetchItems().then(() => {
      this.setState({ loaded: true });
    });
  };

  componentWillUnmount = () => {
    timelineStore.unsubscribe(this.observer);
  };

  render() {
    const { itemWidth, rowHeight, allWeeks } = this.props;
    // if there items are fetched  width is the 200 times total weeks otherwise it's 100vh
    // FIXME: no idea why this is not working with just 16 instead of 21
    const width = allWeeks
      ? itemWidth * allWeeks.length + 21 * allWeeks.length + 'px'
      : '100vw';
    return (
      <div className="rootContainer">
        <ClassBarRowComp groups={this.props.groups} rowHeight={rowHeight} />
        <div
          className={classes.root}
          ref="timelineWrapper"
          onScroll={this.handleScroll}
        >
          <div className={classes.timelineContainer} style={{ width: width }}>
            <div className={classes.rowsContainer}>
              {this.renderWeekComp()}
              {this.renderTaskRowComp()}
            </div>
          </div>
        </div>
        <div ref="buttonsContainer" className={classes.buttonsContainer}>
          <Buttons
            groups={this.props.groups}
            groupsWithIds={this.props.groupsWithIds}
            items={this.props.timelineItems}
            modules={this.props.allModules}
            clickHandler={this.handleClickTodayMarker}
            isTeacher={this.props.isTeacher}
          />
        </div>
      </div>
    );
  }
}
