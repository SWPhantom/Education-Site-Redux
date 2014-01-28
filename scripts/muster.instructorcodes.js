/*!
 * The Gevirtz School Instructor Codes Page v1.1.3
 * http://education.ucsb.edu/webdata/syllabi/instructor_codes.html
 *
 * Copyright (c) 2011, Justin Force
 * Licensed under the BSD 3-Clause License
 */

/*jslint browser: true, indent: 2 */
/*global jQuery, muster */

/*
 *	Output:
 *	 ______________________ ________________
 *		|Instructor						| Code					 |
 *	 	 ______________________ ________________
 *		|Doe, Jane						 | ED199					|
 *	 ______________________ ________________
 *	|Deer, John						| CNSP440				|
 *					.
 *					.
 *					.
 */

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
									'http://education.ucsb.edu/research-faculty/bio?first=',
									this.first_name,
									'&last=',
									this.last_name
								].join('')
							).text([this.last_name, this.first_name].join(', '));
						}
						/*
					function () {
						var html, dl;
						html = $('<div>'); // wrap it for appending
						html.append(this.last_name + ', ' + this.first_name);
						return html.html(); // unwrap it
					}
				*/
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
		], '#facultyInstructorCodes') // Target container for table (<div id="currentlyFunded"></div>)
	});
}(jQuery));




