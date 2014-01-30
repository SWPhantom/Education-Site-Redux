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
	//people = [];
	
	/*function output(peopleList){
		var person = peopleList[Math.floor(Math.random()*peopleList.length)];
		$("#facultySpotlight").append(person.first_name);
	}*/
	
	
		$("#facultySpotlight").append("TEST");

	
	/*muster('ggsedb').query({
		select: 'id, first_name, last_name, faculty_listing_category, biography',
		from: 'profile',
		where: 'id is not null',
		order: 'last_name asc'
	}, function () {
		people.push(this);

		
	});*/
}(jQuery));




