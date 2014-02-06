<?php

/**
 * @file
 * Process theme data.
 *
 * Use this file to run your theme specific implimentations of theme functions,
 * such preprocess, process, alters, and theme function overrides.
 *
 * Preprocess and process functions are used to modify or create variables for
 * templates and theme functions. They are a common theming tool in Drupal, often
 * used as an alternative to directly editing or adding code to templates. Its
 * worth spending some time to learn more about these functions - they are a
 * powerful way to easily modify the output of any template variable.
 * 
 * Preprocess and Process Functions SEE: http://drupal.org/node/254940#variables-processor
 * 1. Rename each function and instance of "adaptivetheme_subtheme" to match
 *    your subthemes name, e.g. if your theme name is "footheme" then the function
 *    name will be "footheme_preprocess_hook". Tip - you can search/replace
 *    on "adaptivetheme_subtheme".
 * 2. Uncomment the required function to use.
 */

/**
 * Preprocess variables for the html template.
 */
/* -- Delete this line to enable.
function ggse_preprocess_html(&$vars) {
  global $theme_key;

  // Two examples of adding custom classes to the body.
  
  // Add a body class for the active theme name.
  // $vars['classes_array'][] = drupal_html_class($theme_key);

  // Browser/platform sniff - adds body classes such as ipad, webkit, chrome etc.
  // $vars['classes_array'][] = css_browser_selector();

}
// */


/**
 * Process variables for the html template.
 */
/* -- Delete this line if you want to use this function
function ggse_process_html(&$vars) {
}
// */


/**
 * Override or insert variables for the page templates.
 */

function ggse_preprocess_page(&$vars) {
	/**oceano added js below */
drupal_add_library('system', 'ui.accordion');
drupal_add_js('jQuery(document).ready(function(){jQuery(".accordion").accordion({active: false, collapsible: true,autoHeight:false });});', 'inline');

}


function ggse_process_page(&$vars) {
}
// */


/**
 * Override or insert variables into the node templates.
 */
/**oceano added js below */
function ggse_preprocess_node(&$vars) {
	if(arg(0) == 'node' && arg(1) == '28' && arg(3) == null) {//ITG login page
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/itg.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/itg.css');
	}else if(arg(0) == 'node' && arg(1) == '348' && arg(3) == null) {//Faculty Spotlight
		drupal_add_js('https://apps.education.ucsb.edu/muster/muster.js', 'external');
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/muster.faculty-spotlight.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/muster.faculty-spotlight.css');
	}else if(arg(0) == 'node' && arg(1) == '498' && arg(3) == null) {//Research Interests
		drupal_add_js('https://apps.education.ucsb.edu/muster/muster.js', 'external');
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/muster.faculty-research-interests.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/muster.faculty-research-interests.css');
	}else if(arg(0) == 'node' && arg(1) == '493' && arg(3) == null) {//Faculty Listing
		drupal_add_js('https://apps.education.ucsb.edu/muster/muster.js', 'external');
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/muster.faculty-listing.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/muster.faculty-listing.css');
	}else if(arg(0) == 'node' && arg(1) == '670' && arg(3) == null){//Faculty Bio Page
		drupal_add_js('https://apps.education.ucsb.edu/muster/muster.js', 'external');
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/muster.faculty-listing.bio.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/muster.faculty-listing.bio.css');
	}else if(arg(0) == 'node' && arg(1) == '492' && arg(3) == null){//Faculty Expertise Page
		drupal_add_js('https://apps.education.ucsb.edu/muster/muster.js', 'external');
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/muster.faculty-expertise-search.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/muster.faculty-expertise-search.css');
	}else if(arg(0) == 'node' && arg(1) == '593' && arg(3) == null){//Currently Funded Page
		drupal_add_js('https://apps.education.ucsb.edu/muster/muster.js', 'external');
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/muster.currentlyfunded.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/muster.currentlyfunded.css');
	}else if(arg(0) == 'node' && arg(1) == '642' && arg(3) == null){//Instructor Codes Page
		drupal_add_js('https://apps.education.ucsb.edu/muster/muster.js', 'external');
		drupal_add_js(drupal_get_path('theme', 'ggse') . '/scripts/muster.instructorcodes.js');
		drupal_add_css(drupal_get_path('theme', 'ggse').'/css/muster.instructorcodes.css');
	}
}
// */


/**
 * Override or insert variables into the comment templates.
 */
/* -- Delete this line if you want to use these functions
function ggse_preprocess_comment(&$vars) {
}
function ggse_process_comment(&$vars) {
}
// */


/**
 * Override or insert variables into the block templates.
 */
/* -- Delete this line if you want to use these functions
function ggse_preprocess_block(&$vars) {}
*/
/*function ggse_process_block(&$vars) {
}
// */

