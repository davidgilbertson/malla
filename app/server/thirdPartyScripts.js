import {VENDORS} from '../constants.js';

export const facebookSnippet = `
window.fbAsyncInit = function() {
  FB.init({
    appId      : '1714981932088680',
    xfbml      : true,
    version    : 'v2.6'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));
`;

export const adWordsSrc = '//www.googleadservices.com/pagead/conversion_async.js';
export const adWordsSnippet = `
/* <![CDATA[ */
goog_snippet_vars = function() {
  var w = window;
  w.google_conversion_id = 1003738231;
  w.google_conversion_label = "oJ5mCL7h7WYQ96jP3gM";
  w.google_remarketing_only = false;
}
// DO NOT CHANGE THE CODE BELOW.
goog_report_conversion = function(url) {
  goog_snippet_vars();
  window.google_conversion_format = "3";
  var opt = new Object();
  opt.onload_callback = function() {
  if (typeof(url) != 'undefined') {
    window.location = url;
  }
}
  var conv_handler = window['google_trackConversion'];
  if (typeof(conv_handler) == 'function') {
    conv_handler(opt);
  }
}
/* ]]> */
`;

export const googleAnalyticsSnippet = `
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', '${VENDORS.GOOGLE_ANALYTICS_TRACKING_ID}', 'auto');
`;

export const googleAnalyticsSrc = 'https://www.google-analytics.com/analytics.js';
export const googleFontsSrc = 'https://fonts.googleapis.com/css?family=Roboto+Slab:400,300|Open+Sans:400,300|Handlee';
