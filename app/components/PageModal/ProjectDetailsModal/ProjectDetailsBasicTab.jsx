import React from 'react';
const {PropTypes} = React;
import slug from 'speakingurl';

import Input from '../../Input/Input.jsx';
import TextArea from '../../TextArea/TextArea.jsx';
import ProjectUsers from './ProjectUsers.jsx';

import {
  DIMENSIONS,
  ROLES,
  TEXT_PADDING,
} from '../../../constants.js';

import {
  css,
  getCurrentProjectAndScreen,
  getPublicUserProps,
} from '../../../utils';

const styles = {
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
};

const ProjectDetailsBasicTab = props => {
  const {key: projectKey, val: project} = getCurrentProjectAndScreen().currentProject;

  if (!project) return null; // if the project is revoked while this modal is open

  const youOwnTheProject = !!project.users && !!project.users[props.user.uid] && project.users[props.user.uid].role === ROLES.OWNER;

  const addUserToProject = user => {
    props.addUserToProject({
      projectKey,
      userKey: user._key,
      user: getPublicUserProps(user),
      role: ROLES.WRITE,
    });
  };

  const removeUserFromProject = user => {
    props.removeUserFromProject({
      projectKey,
      userKey: user._key,
    });
  };

  const updateProject = newProps => {
    props.updateProject(
      projectKey,
      newProps
    );
  };

  return (
    <div>
      <div style={css.settingsRow}>
        <p style={css.labelStyle}>Project name</p>

        <Input
          defaultValue={project.name}
          style={styles.nameInput}
          onEnter={props.hideModal}
          onChange={name => {
            updateProject({
              name,
              slug: slug(name),
            });
          }}
          autoFocus
        />
      </div>

      <div style={css.settingsRow}>
        <ProjectUsers
          user={props.user}
          project={project}
          youOwnTheProject={youOwnTheProject}
          addUserToProject={addUserToProject}
          removeUserFromProject={removeUserFromProject}
        />
      </div>

      <div style={css.settingsRow}>
        <p style={css.labelStyle}>Notes</p>

        <TextArea
          defaultValue={project.description}
          style={styles.descInput}
          onCtrlEnter={props.hideModal}
          onChange={description => {
            updateProject({description});
          }}
        />
      </div>
    </div>
  );
};

ProjectDetailsBasicTab.propTypes = {
  // props
  user: PropTypes.object.isRequired,

  // methods
  updateProject: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  addUserToProject: PropTypes.func.isRequired,
  removeUserFromProject: PropTypes.func.isRequired,
};

export default ProjectDetailsBasicTab;
