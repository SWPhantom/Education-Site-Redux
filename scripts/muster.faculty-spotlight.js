/*!
 * The Gevirtz School Faculty Spotlight Page
 * http://education.ucsb.edu
 *
 * Copyright (c) 2014 Zhenya Frolov, and UC Regents
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
		var people = [];
		$(document).ready(muster('ggsedb').query({
				select: 'id, first_name, last_name, faculty_listing_category, biography',
				from: 'profile',
				where: 'id is not null',
				order: 'id asc',
				limit: '1'
		}, function () {
				var IMG = '<img src="http://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/%s.jpg" alt="%s %s"/>';
				var NAME = '<a href="%s">%s <span class=surname>%s</span></a>';
				var LINK = "/research-faculty/bio?first=%s&last=%s";
				var pic, name, link;
				this.toTable(
				[
						[
								'',

						function () {
								link = LINK.replace('%s', this.first_name).replace('%s', this.last_name);
								pic = $(IMG
										.replace('%s', (this.first_name + this.last_name).toLowerCase().replace(/[^a-z]/g, ''))
										.replace('%s', this.first_name)
										.replace('%s', this.last_name));
								
								pic.bind('error', function () {
								this.src = 'http://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/faculty-placeholder.gif'
								});
								name = $(NAME
										.replace('%s', link)
										.replace('%s', this.first_name)
										.replace('%s', this.last_name));
								
								name.find('a').prepend(pic);
								var temp = "";
								//console.log(pic.img.outerHTML);
								return pic;
								return name;
								/*return $('<a>').attr(
										'href', [
										'/research-faculty/bio?first=',
								this.first_name,
										'&last=',
								this.last_name].join('')).text([this.first_name, this.last_name].join(' '));*/
						}],

						[
								'',

						function () {
								var html, dl;
								html = $('<div>'); // wrap it for appending
								var str1 = this.biography.slice(0, 150) + "... <b>read more</b>";
								html.append(str1 || null);
								return html.html(); // unwrap it
						}]
				], '#facultySpotlight')
		}))
}(jQuery));
