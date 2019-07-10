import React, { Component } from 'react';
import queryString from 'query-string';
import pigData from '../../data/wild-pig-data.json';
import LinerDeterminate from '../liner-determinate';
import Chart from 'react-apexcharts';
import MesageIndicator from '../message-indicator';
import './App.css';

const START_YEAR = pigData['PIG POPULATIONS'][0].year;
const END_YEAR =
  pigData['PIG POPULATIONS'][pigData['PIG POPULATIONS'].length - 1].year;
const PROGRESS_STEP = 16.66666666666667;
let currentYear = 0;
let progress = 0;

class App extends Component {
  state = {
    isPaused: true,
    options: null,
    series: null,
    errorUrlParamYear: false,
    errorUrlParamPaused: false
  };

  handleClickHome = () => {
    this.setState({
      isPaused: true,
      options: null,
      series: null,
      errorUrlParamYear: false,
      errorUrlParamPaused: false
    });
    currentYear = 0;
    progress = 0;
  };

  setUrl(history) {
    history.push(`/?paused=${this.state.isPaused}&year=${currentYear}`);
  }

  getChartData(data, year) {
    return pigData['PIG POPULATIONS']
      .filter(item => item.year === year)
      .map(item => item[data]);
  }
  prepareCharData() {
    return {
      options: {
        xaxis: {
          categories: this.getChartData('island', currentYear)
        },
        title: {
          text: `Pig population in year: ${currentYear}`,
          align: 'center'
        }
      },
      series: [
        {
          name: `Year: ${currentYear}`,
          data: this.getChartData('pigPopulation', currentYear)
        }
      ]
    };
  }

  toggleProgress = history => {
    this.setState(
      state => {
        return {
          isPaused: !state.isPaused
        };
      },
      () => {
        if (this.state.isPaused) {
          clearInterval(this.timer);
        } else {
          this.tick(history);
          this.timer = setInterval(() => {
            this.tick(history);
          }, 2000);
        }
        this.setUrl(history);
      }
    );
  };

  tick = history => {
    if (currentYear === 0) {
      currentYear = START_YEAR;
      progress = PROGRESS_STEP;
    }
    if (currentYear < END_YEAR) {
      currentYear += 1;
      progress += PROGRESS_STEP;
    } else {
      currentYear = START_YEAR;
      progress = PROGRESS_STEP;
    }
    this.setUrl(history);
    this.setState(this.prepareCharData());
  };

  componentDidMount() {
    const { history, location } = this.props;
    const values = queryString.parse(location.search);
    const parsedYearStringToNumber = parseInt(values.year);
    const year =
      typeof parsedYearStringToNumber === 'number' && parsedYearStringToNumber;
    const ratio = year - START_YEAR;
    currentYear = year;
    progress = ratio * PROGRESS_STEP + PROGRESS_STEP;

    if (Object.keys(values).length !== 0) {
      if (values.paused !== 'true' && values.paused !== 'false') {
        this.setState({
          errorUrlParamPaused: true
        });
      }
      if (year < START_YEAR || year > END_YEAR || isNaN(year)) {
        this.setState({
          errorUrlParamYear: true
        });
      }
    }
    if (values.paused === 'true') {
      this.setState(this.prepareCharData());
    }
    if (values.paused === 'false') {
      this.setState({ isPaused: false }, () => {
        this.setUrl(history);
      });
      this.tick(history);
      this.timer = setInterval(() => {
        this.tick(history);
      }, 2000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {
      options,
      series,
      isPaused,
      errorUrlParamYear,
      errorUrlParamPaused
    } = this.state;
    if (errorUrlParamYear) {
      return (
        <MesageIndicator
          handleClickHome={this.handleClickHome}
        >{`URL param 'year' must be a number, ranging from ${START_YEAR} to ${END_YEAR}`}</MesageIndicator>
      );
    }
    if (errorUrlParamPaused) {
      return (
        <MesageIndicator handleClickHome={this.handleClickHome}>
          {`URL param 'paused' must be 'true' or 'false'`}
        </MesageIndicator>
      );
    }

    return (
      <div className='App'>
        <div className='mixed-chart'>
          {options && series ? (
            <Chart
              options={options}
              series={series}
              type='bar'
              width='640'
              height='400'
            />
          ) : (
            <MesageIndicator>
              {'Press play to see animated diagram'}
            </MesageIndicator>
          )}

          <LinerDeterminate
            toggleProgress={this.toggleProgress}
            progress={progress}
            isPaused={isPaused}
          />
        </div>
      </div>
    );
  }
}

export default App;
