/*!
 * The Gevirtz School Faculty Spotlight Page
 * http://education.ucsb.edu
 *
 * Copyright (c) 2014 Justin Force, Zhenya Frolov, and UC Regents
 * Licensed under the BSD 3-Clause License
 */

/*jslint browser: true, indent: 2 */
/*global jQuery, muster */

/*
 *Output:
 *  _____________ ________________
 * |*Instructor  |First 25 words  |
 * |Image*       |of instructor's |
 * |             |biography       |
 * |             |                |
 * |             |                |
 *  -------------                 |
 * |Instructor   |  >Link to their|
 * |Name         |   bio page     |
 *  ------------------------------
 *
 */
(function ($) {
		
		'use strict';
		
		var $facultySpotlight;
		var temp = "Academic Senate Faculty";
		$(document).ready(muster('ggsedb').query({
				select: 'id, first_name, last_name, faculty_listing_category, biography',
				from: 'profile',
				where: "id is not null and faculty_listing_category = 'Academic Senate Faculty'"
		}, function () {
				
				var randomIndex, person, $spotlightContent;
				
				randomIndex = Math.floor(this.results.length * Math.random());
				person = this.results[randomIndex];
				
				$spotlightContent = $('<div>');
				$spotlightContent.append($('<img src="http://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/' + (person.first_name + person.last_name).toLowerCase().replace(/[^a-z]/g, '') + '.jpg"/>'));
				//$spotlightContent.append($('<b>' + person.first_name + ' ' + person.last_name + '</b>'));
				$spotlightContent.append($('' + person.biography.slice(0, 150) + '<p>... </b>more</b></p>'));
				
				$(function () {
						if ($facultySpotlight === undefined) {
								$facultySpotlight = $('#facultySpotlight');
						}
						$facultySpotlight.append($spotlightContent);
				});

		}))
}(jQuery));
