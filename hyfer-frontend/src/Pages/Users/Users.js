/* eslint react/prop-types: error */
import React from 'react';
import styles from '../../assets/styles/users.css';
import Guest from '../../components/Users/Guest';
import Teachers from '../../components/Users/Teachers';
import Students from '../../components/Users/Students';
import SynchronizeGithubData from '../../components/Users/SynchronizeGithubData';
import { errorMessage } from '../../notify';
import { inject , observer } from 'mobx-react';
import PropTypes from 'prop-types';
@inject('userStore')
@observer
export default class Users extends React.Component {
  state = {
    selectedList: '',
  };

  componentWillUnmount() {
    this.props.userStore.resetUser();
  }

  componentDidMount = () => {
    this.props.userStore.loadUsers().catch(errorMessage);
    window.scrollTo(0, 0);
  };

  handlFilterList = e => {
    this.setState({
      selectedList: e.target.value,
    });
  };

  renderSelectedList() {
    if (this.state.selectedList === 'Guest') {
      return (
        <ul className={styles.mainUl}>
          <Guest />
        </ul>
      );
    } else if (this.state.selectedList === 'Students') {
      return (
        <ul className={styles.mainUl}>
          <Students />
        </ul>
      );
    } else if (this.state.selectedList === 'Teachers') {
      return (
        <ul className={styles.mainUl}>
          <Teachers />
        </ul>
      );
    } else {
      return (
        <ul className={styles.mainUl}>
          <Guest />
          <Teachers />
          <Students />
        </ul>
      );
    }
  }

  render() {
    return (
      <div>
        <div className={styles.userSearchDiv}>
          <input
            className={styles.userSearchBox}
            type="text"
            placeholder="lookup someone"
            onChange={this.props.userStore.searchUser}
          />
          <select
            className={styles.listSelector}
            value={this.state.selectedList}
            onChange={e => {
              this.handlFilterList(e);
            }}
          >
            <option value="">All list</option>
            <option value="Guest">Guest</option>
            <option value="Teachers">Teachers</option>
            <option value="Students">Students</option>
          </select>
          <SynchronizeGithubData />
        </div>
        <div>{this.renderSelectedList()}</div>
      </div>
    );
  }
}
Users.wrappedComponent.propTypes = {
  userStore: PropTypes.object.isRequired,

};
