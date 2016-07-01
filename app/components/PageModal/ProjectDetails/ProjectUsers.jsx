import React from 'react';
const {Component, PropTypes} = React;
import Radium from 'radium';

import Input from '../../Input/Input.jsx';
import HtmlSnippet from '../../HtmlSnippet/HtmlSnippet.jsx';
import Avatar from '../../Avatar/Avatar.jsx';

import {
  css,
  fuzzySearch,
  makeArray,
} from '../../../utils';

import {
  ANIMATION_DURATION,
  COLORS,
  DIMENSIONS,
  KEYS,
  ROLES,
} from '../../../constants.js';

class ProjectUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allUsers: [],
      filteredUsers: [],
      showSelect: false,
      selectedIndex: -1,
    };

    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.renderUserSelect = this.renderUserSelect.bind(this);
    this.renderUserSelectOptions = this.renderUserSelectOptions.bind(this);
    this.renderProjectUsers = this.renderProjectUsers.bind(this);
    this.renderUserInput = this.renderUserInput.bind(this);
    this.renderOwner = this.renderOwner.bind(this);
  }

  componentDidMount() {
    fetch('/api/users')
    .then(response => response.json())
    .then(allUsers => {
      this.setState({allUsers});
    });

    window.addEventListener('keydown', this.onKeyDown, false);
  }

  componentDidUpdate(oldProps, oldState) {
    const userCountIncreased = this.state.filteredUsers.length > oldState.filteredUsers.length;

    if (this.state.showSelect && (!oldState.showSelect || userCountIncreased)) {
      this.selectEl.scrollIntoView();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown, false);
  }

  onChange(value) {
    if (!value) {
      this.setState({
        filteredUsers: [],
        showSelect: false,
      });

      return;
    }

    const {props} = this;

    const filteredUsers = fuzzySearch({
      searchStr: value,
      arr: this.state.allUsers,
      prop: 'name',
    })
    .filter(user => {
      if (!user) return false;
      if (!props.project.users) return true;
      if (!props.project.users[user._key]) return true;
      if (props.project.users[user._key] && props.project.users[user._key].role === ROLES.NO_ACCESS) return true;

      return false;
    })
    .slice(0, 10); // if the list is too long the formatting gets messed up

    this.setState({
      filteredUsers,
      showSelect: !!filteredUsers.length,
    });

    if (this.state.selectedIndex > filteredUsers.length - 1) {
      this.setState({
        selectedIndex: filteredUsers.length - 1,
      });
    }
  }

  onKeyDown(e) {
    // select a user by pressing enter
    if (e.keyCode === KEYS.ENTER && this.state.selectedIndex > -1) {
      const userAtIndex = this.state.filteredUsers[this.state.selectedIndex];

      this.selectUser(userAtIndex);
    }

    if (e.keyCode === KEYS.UP && this.state.selectedIndex > -1) {
      this.setState({
        selectedIndex: this.state.selectedIndex - 1,
      });
    }

    if (e.keyCode === KEYS.DOWN && this.state.selectedIndex < this.state.filteredUsers.length - 1) {
      this.setState({
        selectedIndex: this.state.selectedIndex + 1,
      });
    }
  }

  selectUser(user) {
    this.inputComp.setValue(null);

    this.setState({
      filteredUsers: [],
      selectedIndex: -1,
      showSelect: false,
    });

    this.props.addUserToProject(user);
  }

  renderUserSelectOptions() {
    return this.state.filteredUsers.map((user, i) => {
      const highlighted = this.state.selectedIndex === i;

      const styles = {
        optionWrapper: {
          display: 'flex',
          padding: 4,
          overflow: 'hidden',
          backgroundColor: highlighted ? COLORS.PRIMARY_LIGHT : COLORS.WHITE,
          cursor: 'pointer',
        },
        img: {
          flexFlow: '0 0 auto',
        },
        html: {
          marginLeft: 5,
          flexFlow: '0 0 auto',
        },
      };

      return (
        <div
          key={`option-${user._key}`}
          style={styles.optionWrapper}
          title={user.email}
          onMouseDown={() => { // not onClick. We need to beat the onBlur event that hides this element
            this.selectUser(user);
          }}
        >
          <Avatar
            url={user.profileImageURL}
            style={styles.img}
          />

          <HtmlSnippet
            style={styles.html}
            html={user.matchString}
          />
        </div>
      );
    });
  }

  renderUserSelect() {
    if (!this.state.showSelect) return null;

    const style = {
      position: 'absolute',
      width: '100%',
      margin: '4px 0',
      border: `1px solid ${COLORS.GRAY_LIGHT}`,
      ...css.shadow('small'),
    };

    return (
      <div
        ref={el => this.selectEl = el}
        style={style}
      >
        {this.renderUserSelectOptions()}
      </div>
    );
  }

  renderProjectUsers() {
    const {props} = this;

    if (!props.project.users) return null;

    const projectUsers = makeArray(props.project.users)
      .filter(projectUser => projectUser.role === ROLES.WRITE)
      .map(projectUser => ({
        ...projectUser,
        name: projectUser.name + (projectUser._key === props.user.uid ? ' (you)' : ''),
      }));

    if (!projectUsers.length) return null;

    const styles = {
      row: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        color: COLORS.GRAY_DARK,
      },
      img: {
        flex: '0 0 auto',
      },
      name: {
        flex: '1 0 auto',
        marginLeft: 6,
      },
      remove: {
        fontSize: 22,
        fontWeight: 700,
        flex: '0 0 auto',
        padding: '0 8px', // not visible but increases click area
        color: COLORS.GRAY_DARK,
        transition: `color ${ANIMATION_DURATION}ms`,
        cursor: 'pointer',
        ':hover': {
          color: COLORS.ERROR,
        },
      },
    };

    const renderDeleteButton = user => {
      if (!props.youOwnTheProject) return null;

      return (
        <button
          key={`list-user-${user._key}`} // key is for radium to apply :hover
          style={styles.remove}
          title={`Remove ${user.name} from this project`}
          onClick={() => {
            props.removeUserFromProject(user);
          }}
        >×</button>
      );
    };

    return makeArray(projectUsers)
      .map(user => (
        <div
          key={user._key}
          style={styles.row}
          title={user.email}
        >
          <Avatar
            url={user.profileImageURL}
            style={styles.img}
            size={27} // the height of the row is defined by the × font size
          />

          <div style={styles.name}>{user.name}</div>

          {renderDeleteButton(user)}
        </div>
      ));
  }

  renderOwner() {
    const {props} = this;

    const styles = {
      row: {
        marginBottom: DIMENSIONS.SPACE_M,
      },
      ownerRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
      ownerName: {
        marginLeft: 4,
      },
    };

    let owner = makeArray(props.project.users)
      .find(projectUser => projectUser.role === ROLES.OWNER); // so lazy, assuming one only at the moment

    if (!owner) owner = {name: 'unknown, probably you'};

    const you = owner._key === props.user.uid ? ' (you)' : '';

    return (
      <div style={styles.row}>
        <p style={css.labelStyle}>Owner</p>

        <div style={styles.ownerRow}>
          <Avatar
            url={owner.profileImageURL}
            size={30}
          />

          <p style={styles.ownerName}>{owner.name}{you}</p>
        </div>
      </div>
    );
  }

  renderUserInput() {
    if (!this.props.youOwnTheProject) return null;

    const style = {
      width: '100%',
      marginBottom: 10,
      ...css.inputStyle,
    };

    return (
      <Input
        ref={comp => this.inputComp = comp}
        style={style}
        onFocus={() => this.setState({showSelect: !!this.state.filteredUsers.length})}
        onBlur={() => this.setState({showSelect: false})}
        onChange={this.onChange}
        placeholder="Add a user to this project"
      />
    );
  }

  render() {
    if (!this.props.project.users) return null; // this shouldn't be possible, maybe old data or I missed something

    const styles = {
      row: {
        position: 'relative', // to contain the absolute drop-down
        marginTop: DIMENSIONS.SPACE_M,
      },
    };

    return (
      <div style={styles.row}>
        {this.renderOwner()}

        <p style={css.labelStyle}>Users with access to this project</p>

        {this.renderUserInput()}

        {this.renderUserSelect()}

        {this.renderProjectUsers()}
      </div>
    );
  }
}

ProjectUsers.propTypes = {
  // props
  project: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  youOwnTheProject: PropTypes.bool.isRequired,

  // methods
  addUserToProject: PropTypes.func.isRequired,
  removeUserFromProject: PropTypes.func.isRequired,
};

export default Radium(ProjectUsers);
