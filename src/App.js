import React, { Component } from 'react';
import styled from 'styled-components';

import DataInput from './data/DataInput';
import WeeklyTrendChart from './charts/WeeklyTrendChart';
import PunchCardChart from './charts/PunchCardChart';
import BugTypePieChart from './charts/BugTypePieChart';
import ModulePieChart from './charts/ModulePieChart';
import GaugeChart from './charts/GaugeChart';
import SnapshotButton from './data/SnapshotButton';

import styles from './App.css';

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #090A0B;
`;

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 20px 0;
`;

const ChartSection = styled.div`
  width: 90%;
  margin: 20px 0;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bugs: [],
      filename: '',
    };

    this.onBugsChange = (bugs, filename) => this.setState({ bugs, filename });
  }

  render() {
    const { bugs, filename } = this.state;
    const title = filename.split(' ')[0];

    if (bugs.length <= 0) {
      return (
        <Container>
          <DataInput className={styles.fileInput} onChange={this.onBugsChange}/>
        </Container>
      );
    } else {
      return (
        <Container>
          <Title>{title}</Title>
          <ChartSection>
            <WeeklyTrendChart className={styles.chart} bugs={bugs} width="100%" height="500px"/>
          </ChartSection>
          <ChartSection>
            <PunchCardChart className={styles.chart} bugs={bugs} width="100%" height="500px"/>
          </ChartSection>
          <ChartSection>
            <BugTypePieChart className={styles.chart} bugs={bugs} width="100%" height="700px"/>
          </ChartSection>
          <ChartSection>
            <ModulePieChart className={styles.chart} bugs={bugs} width="100%" height="700px"/>
          </ChartSection>
          <ChartSection>
            <GaugeChart className={styles.chart} bugs={bugs} width="100%" height="500px"/>
          </ChartSection>
          <SnapshotButton className={styles.snapshotBtn} filename={title + '_分析报告'}/>
        </Container>
      );
    }
  }
}

export default App;
