const shouldSendEvents = (
  typeof window !== 'undefined'
  && process.env.NODE_ENV === 'production'
);

export const EVENTS = {
  CATEGORIES: {
    SYSTEM: 'System', // load times, db sign in/out
    UI_INTERACTION: 'UI interaction', // clicking, navigating, opening modals, etc.
    DATA_INTERACTION: 'Data interaction', // interacting with project/screen/box objects
  },
  ACTIONS: {
    // System
    AUTO_SIGN_IN: 'Auto sign in',
    API_HIT: 'API hit',
    SIGNED_UP: 'Signed up', // a database thing
    SIGNED_IN: 'Signed in', // a database thing
    SIGNED_OUT: 'Signed out', // a database thing
    DATA_LOAD_TIME: 'Data load time',
    SENT_FEEDBACK: 'Sent feedback',
    
    // UI interaction
    OPENED_MODAL: 'Opened modal',
    PLAYED_VIDEO: 'Played video',
    HID_HELP: 'Hid help',
    SHOWED_HELP: 'Showed help',
    GAVE_FEEDBACK: 'Gave feedback',
    CLOSED_INTRO: 'Closed intro',
    CLICKED: {
      SHARE_FACEBOOK: 'Shared on Facebook',
      SHARE_TWITTER: 'Shared on Twitter',
      SHARE_LINKEDIN: 'Shared on LinkedIn',
      MY_PROJECTS: 'Clicked "My projects"',
      EXPORT_DATA: 'Clicked "Export data"',
      FEEDBACK: 'Clicked "Feedback"',
      SIGN_IN: 'Clicked "Sign in"',
      SIGN_IN_WITH_FACEBOOK: 'Clicked "Sign in with Facebook"',
      SIGN_IN_WITH_GOOGLE: 'Clicked "Sign in with Google"',
      SIGN_IN_WITH_TWITTER: 'Clicked "Sign in with Twitter"',
      SIGN_UP: 'Clicked "Sign up"',
      SIGN_OUT: 'Clicked "Sign out"',
    },
    
    // Data interaction
    TIME_TO_ADD_FIRST_BOX: 'Time to add first box',
    TIME_TO_MOVE_FIRST_BOX: 'Time to move first box',
    TIME_TO_TYPE_IN_FIRST_BOX: 'Time to type in first box',
    BOUGHT_BOXES: 'Bought boxes',
    ADDED_PROJECT: 'Added project',
    REMOVED_PROJECT: 'Removed project',
    ADDED_SCREEN: 'Added screen',
    REMOVED_SCREEN: 'Removed screen',
    ADDED_BOX: 'Added box',
    MOVED_BOX: 'Edited box',
    TYPED_IN_BOX: 'Typed in box',
    REMOVED_BOX: 'Removed box',
  },
};

export function setPage(page) {
  if (!shouldSendEvents) return;

  ga('set', 'page', page);
  ga('send', 'pageview');
}

export function setBrowserDetails() {
  if (!shouldSendEvents) return;

  ga('set', 'viewportWidth', window.innerWidth);
  ga('set', 'viewportHeight', window.innerHeight);
}

export function setUserDetails(user) {
  if (!shouldSendEvents) return;

  if (!user) {
    ga('set', 'username', '');
  } else {
    ga('set', 'username', user.name);
  }
}

export function sendEvent(options) {
  if (!shouldSendEvents) return;

  const fieldsObject = {};

  if (options.category !== undefined) fieldsObject.eventCategory = options.category;
  if (options.action !== undefined) fieldsObject.eventAction = options.action;
  if (options.label !== undefined) fieldsObject.eventLabel = options.label;
  if (options.value !== undefined) fieldsObject.eventValue = options.value;

  ga('send', {
    hitType: 'event',
    ...fieldsObject,
  });

  if (options.action === EVENTS.ACTIONS.SIGNED_UP) {
    if (typeof goog_report_conversion !== 'undefined') {
      goog_report_conversion();
    } else {
      console.warn('Sign up successful but goog_report_conversion() was not available');
    }
  }
}
