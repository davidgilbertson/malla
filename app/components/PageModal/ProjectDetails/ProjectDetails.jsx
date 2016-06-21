import React from 'react';
const {PropTypes} = React;
import slug from 'speakingurl';

import PageModalWrapper from '../PageModalWrapper.jsx';

import {
  BOX_TYPES,
  COLORS,
  DIMENSIONS,
  TEXT_PADDING,
} from '../../../constants.js';

import {
  css,
  getCurrentProjectAndScreen,
  makeArray,
} from '../../../utils';

const styles = {
  nameInput: {
    width: '100%',
    ...css.inputStyle,
    ...css.shadow('inset'),
  },
  descInput: {
    width: '100%',
    marginTop: DIMENSIONS.SPACE_S,
    height: DIMENSIONS.SPACE_L * 2,
    resize: 'none',
    ...css.inputStyle,
    padding: TEXT_PADDING,
    ...css.shadow('inset'),
  },
  deleteRow: {
    color: COLORS.ERROR,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 400,
  },
};

const ProjectDetails = props => {
  let nameEl;
  let descriptionEl;

  const project = props.mode === 'add'
    ? {val: {name: '', description: ''}}
    : getCurrentProjectAndScreen().currentProject;
  
  const upsertProject = () => {
    if (nameEl.value) {
      if (props.mode === 'add') {
        props.addProject({
          name: nameEl.value,
          slug: slug(nameEl.value),
          description: descriptionEl.value,
        });
      } else {
        props.updateProject(project.key, {
          name: nameEl.value,
          slug: slug(nameEl.value),
          description: descriptionEl.value,
        });
      }
    }

    props.hideModal();
  };

  const deleteProject = () => {
    let sure = true;
    let msg = `Are you sure you want to delete '${project.val.name}'?`;

    const screenCount = makeArray(props.screens)
      .filter(screen => !screen.deleted && screen.projectKey === project.key)
      .length;

    const boxCount = makeArray(props.boxes)
      .filter(box => !box.deleted && box.type !== BOX_TYPES.LABEL && box.projectKey === project.key)
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
      props.removeProject(project.key);
      props.hideModal();
    }
  };

  const renderDeleteButton = () => {
    if (props.mode === 'add') return null;

    const projects = makeArray(props.projects)
      .filter(project => !project.deleted);

    if (projects.length <= 1) return null;

    return (
      <div style={styles.deleteRow}>
        <button
          onClick={deleteProject}
          tabIndex="-1"
        >
          Delete this project
        </button>
      </div>
    );
  };

  return (
    <PageModalWrapper
      {...props}
      title={props.mode === 'add' ? 'Add a project' : 'Edit project'}
      width={DIMENSIONS.SPACE_L * 7}
      showOk={true}
      okText={'Save'}
      onOk={upsertProject}
    >
      <div>
        <input
          ref={el => nameEl = el}
          defaultValue={project.val.name}
          style={styles.nameInput}
          autoFocus={true}
        />
      </div>

      <div>
        <textarea
          ref={el => descriptionEl = el}
          defaultValue={project.val.description}
          style={styles.descInput}
        />
      </div>

      {renderDeleteButton()}
    </PageModalWrapper>
  );
};

ProjectDetails.propTypes = {
  // props
  mode: PropTypes.oneOf(['add', 'edit']),
  currentScreenKey: PropTypes.string,
  screens: PropTypes.object,
  projects: PropTypes.object,
  boxes: PropTypes.object,

  // methods
  addProject: PropTypes.func.isRequired,
  updateProject: PropTypes.func.isRequired,
  removeProject: PropTypes.func.isRequired,
};

export default ProjectDetails;
