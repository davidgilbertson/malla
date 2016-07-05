import React from 'react';
const {Component, PropTypes} = React;

import PageModalWrapper from '../PageModalWrapper.jsx';
import ProjectDetailsBasicTab from './ProjectDetailsBasicTab.jsx';
import ApiAccessSettings from '../../ApiAccessSettings/ApiAccessSettings.jsx';

import {
  BOX_TYPES,
  COLORS,
  DIMENSIONS,
  ROLES,
} from '../../../constants.js';

import {
  getCurrentProjectAndScreen,
  makeArray,
  userOwnsProject,
} from '../../../utils';

const styles = {
  panelBody: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  bodyRow: {
    display: 'flex',
    flex: '1 1 auto',
    height: DIMENSIONS.SPACE_L * 11,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    borderRight: `1px solid ${COLORS.GRAY_LIGHT}`,
    flex: '0 0 auto',
    width: DIMENSIONS.SPACE_L * 3,
  },
  tab: {
    cursor: 'pointer',
    padding: 14,
    textAlign: 'right',
    borderBottom: `1px solid ${COLORS.GRAY_LIGHT}`,
    ':focus': {
      outline: 'none',
    },
  },
  tabBody: {
    flex: '1 1 auto',
    overflow: 'auto',
    padding: DIMENSIONS.SPACE_S,
  },
  actionsRow: {
    display: 'flex',
    flex: '0 0 auto',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: DIMENSIONS.SPACE_S,
    backgroundColor: COLORS.OFF_WHITE,
    boxShadow: `inset 0 1px 3px ${COLORS.GRAY_LIGHT_FADE}`,
    zIndex: 1, // to put it above the scrolling panel body.
  },
  saveButton: {
    width: DIMENSIONS.SPACE_L * 2,
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    color: COLORS.WHITE,
  },
};

const TABS = [
  {
    key: 'project-details',
    title: 'Project details',
    component: ProjectDetailsBasicTab,
  },
  {
    key: 'api-access',
    title: 'API access',
    component: ApiAccessSettings,
  },
];

class ProjectDetailsModal extends Component {
  constructor(props) {
    super(props);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.renderTabs = this.renderTabs.bind(this);

    const project = getCurrentProjectAndScreen().currentProject.val;
    this.projectKey = getCurrentProjectAndScreen().currentProject.key;
    this.youOwnTheProject = !!project.users && !!project.users[props.user.uid] && project.users[props.user.uid].role === ROLES.OWNER;

    this.state = {
      activeTab: TABS[0],
    };
  }

  deleteProject() {
    const {currentProject} = getCurrentProjectAndScreen();
    const {props} = this;

    let sure = true;
    let msg = `Are you sure you want to delete '${currentProject.val.name}'?`;

    const screenCount = makeArray(props.screens)
      .filter(screen => !screen.deleted && screen.projectKey === this.projectKey)
      .length;

    const boxCount = makeArray(props.boxes)
      .filter(box => !box.deleted && box.type !== BOX_TYPES.LABEL && box.projectKey === this.projectKey)
      .length;

    if (screenCount && boxCount) {
      msg += `\nThis will also delete the ${screenCount} screen${screenCount === 1 ? '' : 's'} `;
      msg += `and ${boxCount} text item${boxCount === 1 ? '' : 's'} in the project.`;
    } else if (screenCount > 0) {
      msg += `\nThis will also delete the ${screenCount} screen${screenCount === 1 ? '' : 's'} in it.`;
    } else if (boxCount > 0) {
      msg += `\nThis will also delete the ${boxCount} text item${boxCount === 1 ? '' : 's'} in it.`;
    }

    if (screenCount || boxCount) {
      sure = window.confirm(msg);
    }

    if (sure) {
      props.removeProject(this.projectKey);
      props.hideModal();
    }
  }

  updateProject(newProps) {
    this.props.updateProject(this.projectKey, newProps);
  }

  renderDeleteButton() {
    const {props} = this;
    if (props.mode === 'add' || !this.youOwnTheProject) return null;

    // a user can't delete the last project that they own
    const ownedProjects = makeArray(props.projects).filter(project => !project.deleted && userOwnsProject(props.user, project));

    if (ownedProjects.length <= 1) return null;

    const style = {
      color: COLORS.ERROR,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 400,
    };

    return (
      <button
        style={style}
        onClick={this.deleteProject}
        tabIndex="-1"
      >
        Delete this project
      </button>
    );
  }

  renderTabs() {
    const tabEls = TABS.map(tab => {
      const isActive = this.state.activeTab.key === tab.key;

      let style = {...styles.tab};

      if (isActive) {
        style.color = COLORS.WHITE;
        style.backgroundColor = COLORS.ACCENT;
        style.borderBottom = 0;
      }

      return (
        <button
          key={tab.key}
          style={style}
          onClick={() => this.setState({activeTab: tab})}
        >{tab.title}</button>
      );
    });

    return <div style={styles.tabs}>{tabEls}</div>;
  }

  render() {
    const {props} = this;
    const {currentProject} = getCurrentProjectAndScreen();
    if (!currentProject.val) return null; // if the project is revoked while this modal is open

    const TabBody = this.state.activeTab.component;

    return (
      <PageModalWrapper
        {...props}
        title={props.mode === 'add' ? 'Add a project' : 'Edit project'}
        width={DIMENSIONS.SPACE_L * 16}
        showOk={false}
        panelBodyStyle={styles.panelBody}
      >
        <div style={styles.bodyRow}>
          {this.renderTabs()}

          <div style={styles.tabBody}>
            <TabBody
              {...props}
              project={currentProject}
            />
          </div>
        </div>

        <div style={styles.actionsRow}>
          <div>
            {this.renderDeleteButton()}
          </div>

          <button
            style={styles.saveButton}
            onClick={props.hideModal}
          >Done</button>
        </div>
      </PageModalWrapper>
    );
  }
}

ProjectDetailsModal.propTypes = {
  // props
  mode: PropTypes.oneOf(['add', 'edit']),
  screens: PropTypes.object,
  projects: PropTypes.object,
  boxes: PropTypes.object,
  user: PropTypes.object.isRequired,

  // methods
  updateProject: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
};

export default ProjectDetailsModal;
