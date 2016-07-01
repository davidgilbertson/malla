import React from 'react';
const {Component, PropTypes} = React;
import slug from 'speakingurl';

import PageModalWrapper from '../PageModalWrapper.jsx';
import Input from '../../Input/Input.jsx';
import TextArea from '../../TextArea/TextArea.jsx';
import ProjectUsers from './ProjectUsers.jsx';

import {
  BOX_TYPES,
  COLORS,
  DIMENSIONS,
  ROLES,
  TEXT_PADDING,
} from '../../../constants.js';

import {
  css,
  getCurrentProjectAndScreen,
  getPublicUserProps,
  makeArray,
  userOwnsProject,
} from '../../../utils';

const styles = {
  row: {
    marginBottom: DIMENSIONS.SPACE_M,
  },
  nameInput: {
    width: '100%',
    ...css.inputStyle,
    ...css.shadow('inset'),
  },
  descInput: {
    width: '100%',
    height: DIMENSIONS.SPACE_L * 2,
    resize: 'none',
    ...css.inputStyle,
    padding: TEXT_PADDING,
    ...css.shadow('inset'),
  },
  saveButton: {
    display: 'block',
    width: DIMENSIONS.SPACE_L * 2,
    backgroundColor: COLORS.PRIMARY,
    margin: `${DIMENSIONS.SPACE_M}px auto`,
    padding: 12,
    color: COLORS.WHITE,
  },
};

class ProjectDetails extends Component {
  constructor(props) {
    super(props);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.renderDeleteButton = this.renderDeleteButton.bind(this);
    this.addUserToProject = this.addUserToProject.bind(this);
    this.removeUserFromProject = this.removeUserFromProject.bind(this);

    const project = getCurrentProjectAndScreen().currentProject.val;
    this.projectKey = getCurrentProjectAndScreen().currentProject.key;
    this.youOwnTheProject = !!project.users && !!project.users[props.user.uid] && project.users[props.user.uid].role === ROLES.OWNER;
  }

  addUserToProject(user) {
    this.props.addUserToProject({
      projectKey: this.projectKey,
      userKey: user._key,
      user: getPublicUserProps(user),
      role: ROLES.WRITE,
    });
  }

  removeUserFromProject(user) {
    this.props.removeUserFromProject({
      projectKey: this.projectKey,
      userKey: user._key,
    });
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
      margin: '20px 0 5px',
    };

    return (
      <div style={style}>
        <button
          onClick={this.deleteProject}
          tabIndex="-1"
        >
          Delete this project
        </button>
      </div>
    );
  }

  render() {
    const {props} = this;
    const {currentProject} = getCurrentProjectAndScreen();
    if (!currentProject.val) return null; // if the project is revoked while this modal is open

    return (
      <PageModalWrapper
        {...props}
        title={props.mode === 'add' ? 'Add a project' : 'Edit project'}
        width={DIMENSIONS.SPACE_L * 7}
        showOk={false}
      >
        <div style={styles.row}>
          <p style={css.labelStyle}>Project name</p>

          <Input
            defaultValue={currentProject.val.name}
            style={styles.nameInput}
            onEnter={props.hideModal}
            onChange={name => {
              this.updateProject({
                name,
                slug: slug(name),
              });
            }}
            autoFocus
          />
        </div>

        <div style={styles.row}>
          <ProjectUsers
            user={props.user}
            project={currentProject.val}
            youOwnTheProject={this.youOwnTheProject}
            addUserToProject={this.addUserToProject}
            removeUserFromProject={this.removeUserFromProject}
          />
        </div>

        <div style={styles.row}>
          <p style={css.labelStyle}>Notes</p>

          <TextArea
            defaultValue={currentProject.val.description}
            style={styles.descInput}
            onCtrlEnter={props.hideModal}
            onChange={description => {
              this.updateProject({description});
            }}
          />
        </div>

        <div style={styles.row}>
          <button
            style={styles.saveButton}
            onClick={props.hideModal}
          >Done</button>
        </div>

        {this.renderDeleteButton()}
      </PageModalWrapper>
    );
  }
}

ProjectDetails.propTypes = {
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
  addUserToProject: PropTypes.func.isRequired,
  removeUserFromProject: PropTypes.func.isRequired,
};

export default ProjectDetails;
