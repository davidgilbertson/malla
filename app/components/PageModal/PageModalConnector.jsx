import {connect} from 'react-redux';

import * as actions from '../../data/actions.js';
import PageModal from './PageModal.jsx';

export default connect(state => state, () => actions)(PageModal);
