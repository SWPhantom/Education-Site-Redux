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

 
///*
(function ($) {
	'use strict';
	var people = [];
	$(document).ready(muster('ggsedb').query({
		select: 'id, first_name, last_name, faculty_listing_category, biography',
		from: 'profile',
		where: 'id is not null',
		//order: 'RAND()',
		limit: '1'
	}, function () {

	this.toTable(
			[
				[
					'Test1',
			function () {
							return $('<a>').attr(
								'href',
								[
									'/research-faculty/bio?first=',
									this.first_name,
									'&last=',
									this.last_name
								].join('')
							).text([this.last_name, this.first_name].join(', '));
						}
				],

			[
				'Test2',

				function () {
					var html, dl;
					html = $('<div>'); // wrap it for appending
					html.append(this.biography || null);
					return html.html(); // unwrap it
				}
			]
		], '#facultySpotlight')

	/*
		people.push(this);
		$("#facultySpotlight").append(this);*/
	}))
/*
	$(document).ready(function output(peopleList){
		var container = document.getElementById("facultySpotlight");
		var person = peopleList[Math.floor(Math.random()*peopleList.length)];
		var div = document.createElement("div");
		div.innerHTML = "Hats";
		$(container).append(div);
	})
	*/
	
	//$("#facultySpotlight").append("TEST");
	//document.getElementById('facultySpotlight').innerHTML = '<b>this will appear bold</b>';
	
	
	//$(document).ready(output(people));
}(jQuery));
//*/


//=================================================================================================================================
/*
(function ($) {

	'use strict';

	muster('ggsedb').query({
		select: 'id, first_name, last_name, instructor_code',
		from: 'profile',
		where: 'instructor_code is not null',
		order: 'last_name asc'
	}, function () {
		this.toTable(
			[
				[
					'Instructor',
			function () {
							return $('<a>').attr(
								'href',
								[
									'/research-faculty/bio?first=',
									this.first_name,
									'&last=',
									this.last_name
								].join('')
							).text([this.last_name, this.first_name].join(', '));
						}
				],

			[
				'Code',

				function () {
					var html, dl;
					html = $('<div>'); // wrap it for appending
					html.append(this.instructor_code || null);
					return html.html(); // unwrap it
				}
			]
		], '#facultySpotlight') // Target container for table (<div id="currentlyFunded"></div>)
	});
}(jQuery));


*/

