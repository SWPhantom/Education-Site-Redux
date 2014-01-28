/*!
 * Faculty Listing
 * http://education.ucsb.edu/Faculty-Research/Faculty-Listing/
 *
 * Copyright (c) 2011 Justin Force and the UC Regents
 * Licensed under the BSD 3-Clause License
 */

/*jslint browser: true, indent: 2 */
/*global jQuery, muster */

(function ($) {

	'use strict';

	var people,
		LINK = "/research-faculty/bio?first=%s&last=%s",
		NAME = '<h3><a href="%s">%s <span class=surname>%s</span></a></h3>',
		IMG = '<img src="http://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/%s.jpg" alt="%s %s %s"/>';



	function personHas(person, field, value) {
		return person.data(field).match(value) !== null;
	}



	// Add a <select> which allows you to filter the results displayed
	function addFilter() {

		var filter,
			hiddenPeople = $('<div>'), // A place to keep the rows that "hide" from the table
			form = $('<form><label for=friFilter>Filter by department and emphasis: <select id=friFilter></select></label></form>');

		filter = form.find('select');

		$.each([
			{
				label: '-- Show All --',
				filter: function () {
					return true;
				}
			},
			{
				label: 'Department of Counseling, Clinical & School Psychology',
				filter: function () {
					return personHas($(this), 'Departments', 'CCSP');
				}
			},
			{
				label: ' &nbsp; &nbsp; Clinical Psychology',
				filter: function () {
					return personHas($(this), 'Emphases', 'Clinical Psychology');
				}
			},
			{
				label: ' &nbsp; &nbsp; School Psychology Credential',
				filter: function () {
					return personHas($(this), 'Emphases', 'School Psychology Credential');
				}
			},
			{
				label: ' &nbsp; &nbsp; Counseling Psychology',
				filter: function () {
					return personHas($(this), 'Emphases', 'Counseling Psychology');
				}
			},
			{
				label: 'Department of Education',
				filter: function () {
					return personHas($(this), 'Departments', 'EDUC');
				}
			},
			{
				label: ' &nbsp; &nbsp; Child and Adolescent Development',
				filter: function () {
					return personHas($(this), 'Emphases', 'Child and Adolescent Development');
				}
			},
			{
				label: ' &nbsp; &nbsp; Cultural Perspectives &amp; Comparative Education',
				filter: function () {
					return personHas($(this), 'Emphases', 'Cultural Perspectives & Comparative Education');
				}
			},
			{
				label: ' &nbsp; &nbsp; Educational Leadership and Organizations',
				filter: function () {
					return personHas($(this), 'Emphases', 'Educational Leadership and Organizations');
				}
			},
			{
				label: ' &nbsp; &nbsp; Joint Doctoral Program in Educational Leadership',
				filter: function () {
					return personHas($(this), 'Emphases', 'Joint Doctoral Program in Educational Leadership');
				}
			},
			{
				label: ' &nbsp; &nbsp; Research Methodology',
				filter: function () {
					return personHas($(this), 'Emphases', 'Research Methodology');
				}
			},
			{
				label: ' &nbsp; &nbsp; Special Education, Disabilities &amp; Risk Studies',
				filter: function () {
					return personHas($(this), 'Emphases', 'Special Education, Disabilities & Risk Studies');
				}
			},
			{
				label: ' &nbsp; &nbsp; Teaching &amp; Learning',
				filter: function () {
					return personHas($(this), 'Emphases', 'Teaching & Learning');
				}
			},
			{
				label: 'Teacher Education Program',
				filter: function () {
					return personHas($(this), 'Departments', 'TEP');
				}
			},
			{
				label: ' &nbsp; &nbsp; Multiple Subject',
				filter: function () {
					return personHas($(this), 'Emphases', 'Multiple Subject');
				}
			},
			{
				label: ' &nbsp; &nbsp; Single Subject',
				filter: function () {
					return personHas($(this), 'Emphases', 'Single Subject');
				}
			},
			{
				label: ' &nbsp; &nbsp; Special Education Credential',
				filter: function () {
					return personHas($(this), 'Emphases', 'Special Education Credential');
				}
			},
			{
				label: ' &nbsp; &nbsp; Science/Math Initiative',
				filter: function () {
					return personHas($(this), 'Emphases', 'Science/Math Initiative');
				}
			}
		], function () {

			// Attach the filter function to the <option> object and append the
			// <option> to the <select>
			filter.append(
				$('<option>' + this.label + '</option>').data('filter', this.filter)
			);
		});

		// Insert the filter before the table
		people.prepend(form);

		/* When an option is selected, move all of the rows into the hidden table,
		 * then bring back the ones that match the filter defined by the option.
		 * Afterwards, we sort the table by Name by marking the header as unsorted
		 * (removing the sorted and rsorted classes) and then clicking it.
		 */
		filter.change(function () {
			var func = filter.find('option:selected').data('filter');

			if (func) {
				hiddenPeople.append(people.find('.person'));
				people.append(hiddenPeople.find('.person').filter(func).mergeSort(function (left, right) {
					left = $(left).find('h3 .surname').text();
					right = $(right).find('h3 .surname').text();
					if (left < right) {
						return -1;
					} else if (left === right) {
						return 0;
					} else {
						return 1;
					}
				}));
			}

			// XXX If the adjustLayout function exists in the global scope, it means
			// that we're on one of the pages using the old, stupid 3 column layout
			// script. After a filter, we have to adjust the layout.
			//
			if (window.adjustLayout) {
				window.adjustLayout();
			}
		});
	}


	muster('ggsedb').query({

		select: [
			'profile.id', // needed for serialization
			'first_name',
			'last_name',
			'profile.working_title',
			'emphasis_type_1.name as emphasis1',
			'emphasis_type_2.name as emphasis2',
			'emphasis_type_3.name as emphasis3',
			'department_1.acronym as department1',
			'department_2.acronym as department2',
			'profile.faculty_listing_category'
		].join(','),

		from: [
			'profile',
			'emphasis on emphasis.profile_id = profile.id',
			'emphasis_type_1 on emphasis.emphasis_type_id_1 = emphasis_type_1.id',
			'emphasis_type_2 on emphasis.emphasis_type_id_2 = emphasis_type_2.id',
			'emphasis_type_3 on emphasis.emphasis_type_id_3 = emphasis_type_3.id',
			'department_1 on profile.department1_id = department_1.id',
			'department_2 on profile.department2_id = department_2.id'
		].join(' left join '),

		where: [
			"profile.active = 'yes'" //and profile.faculty_listing_category = 'Academic Senate Faculty'"
		].join(' and '),

		order: 'last_name asc'

	}, function () {

		people = $('<div>');

		people.data('sort', function () {

		});

		$.each(this.serializeBy('id').results, function () {
			var person, pic, name, link, working_title;

			person = $('<div class=person></div>');

			link = LINK.replace('%s', this.first_name).replace('%s', this.last_name);

			// JSLint doesn't like negations in regexp, but it really is the clearest
			// way to say "letters only". Below, we disable JSLint scrutiny of
			// regular expressions for just that line.
			/*jslint regexp: true */
			pic = $(IMG
				.replace('%s', (this.first_name + this.last_name).toLowerCase().replace(/[^a-z]/g, ''))
				.replace('%s', this.working_title)
				.replace('%s', this.first_name)
				.replace('%s', this.last_name));
			/*jslint regexp: false */

			// Show a place holder if the image doesn't exist
			pic.bind('error', function () {
				this.src = 'http://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/faculty-placeholder.gif'
			});

			name = $(NAME
				.replace('%s', link)
				.replace('%s', this.first_name)
				.replace('%s', this.last_name));

			working_title = $('<h4>' + this.working_title + '</h4>');

			// insert picture into link before text
			name.find('a').prepend(pic);

			person.append(name).append(working_title).click(function (event) {

				var href = $(this).find('a').attr('href');

				event.stopPropagation();

				// If this was a middle mouse button or Shift or Command click, open in a new window
				if (event.button === 1 ||
						(event.button === 0 &&
						(event.metaKey === true ||
							event.ctrlKey === true ||
							event.shiftKey === true))) {
					window.open(href);
					return false;
				} else {
					location.href = href;
				}
			});
			people.append(person);

			person.data('Departments', [this.department1, this.department2].join('; '));

			person.data('Emphases', [this.emphasis1, this.emphasis2, this.emphasis3].join('; '));

		});


		$(function () {
			$('#facultyListing').replaceWith(people.attr('id', 'facultyListing'));
			addFilter();

			// XXX If the adjustLayout function exists in the global scope, it means
			// that we're on one of the pages using the old, stupid 3 column layout
			// script. After a filter, we have to adjust the layout.
			//
			if (window.adjustLayout) {
				window.adjustLayout();
			}

		});

	});

	/*muster('ggsedb').query({

		select: [
			'profile.id', // needed for serialization
			'first_name',
			'last_name',
			'profile.title',
			'emphasis_type_1.name as emphasis1',
			'emphasis_type_2.name as emphasis2',
			'emphasis_type_3.name as emphasis3',
			'department_1.acronym as department1',
			'department_2.acronym as department2',
			'profile.faculty_listing_category'
		].join(','),

		from: [
			'profile',
			'emphasis on emphasis.profile_id = profile.id',
			'emphasis_type_1 on emphasis.emphasis_type_id_1 = emphasis_type_1.id',
			'emphasis_type_2 on emphasis.emphasis_type_id_2 = emphasis_type_2.id',
			'emphasis_type_3 on emphasis.emphasis_type_id_3 = emphasis_type_3.id',
			'department_1 on profile.department1_id = department_1.id',
			'department_2 on profile.department2_id = department_2.id'
		].join(' left join '),

		where: [
			"profile.active = 'yes' andprofile.faculty_listing_category = 'Lecturer-Academic Coordinator-Teacher Supervisor'"
		].join(' and '),

		order: 'last_name asc'

	}, function () {

		people = $('<div>');

		people.data('sort', function () {

		});

		$.each(this.serializeBy('id').results, function () {
			var person, pic, name, link, title;

			person = $('<div class=person></div>');

			link = LINK.replace('%s', this.first_name).replace('%s', this.last_name);


			name = $(NAME
				.replace('%s', link)
				.replace('%s', this.first_name)
				.replace('%s', this.last_name));

			title = $('<h4>' + this.title + '</h4>');


			person.append(name).append(title).click(function (event) {

				var href = $(this).find('a').attr('href');

				event.stopPropagation();

				// If this was a middle mouse button or Shift or Command click, open in a new window
				if (event.button === 1 ||
						(event.button === 0 &&
						(event.metaKey === true ||
							event.ctrlKey === true ||
							event.shiftKey === true))) {
					window.open(href);
					return false;
				} else {
					location.href = href;
				}
			});
			people.append(person);

			person.data('Departments', [this.department1, this.department2].join('; '));

			person.data('Emphases', [this.emphasis1, this.emphasis2, this.emphasis3].join('; '));

		});


		$(function () {
			$('#facultyListing2').replaceWith(people.attr('id', 'facultyListing'));

			// XXX If the adjustLayout function exists in the global scope, it means
			// that we're on one of the pages using the old, stupid 3 column layout
			// script. After a filter, we have to adjust the layout.
			//
			if (window.adjustLayout) {
				window.adjustLayout();
			}

		});

	});

	muster('ggsedb').query({

		select: [
			'profile.id', // needed for serialization
			'first_name',
			'last_name',
			'profile.title',
			'emphasis_type_1.name as emphasis1',
			'emphasis_type_2.name as emphasis2',
			'emphasis_type_3.name as emphasis3',
			'department_1.acronym as department1',
			'department_2.acronym as department2',
			'profile.faculty_listing_category'
		].join(','),

		from: [
			'profile',
			'emphasis on emphasis.profile_id = profile.id',
			'emphasis_type_1 on emphasis.emphasis_type_id_1 = emphasis_type_1.id',
			'emphasis_type_2 on emphasis.emphasis_type_id_2 = emphasis_type_2.id',
			'emphasis_type_3 on emphasis.emphasis_type_id_3 = emphasis_type_3.id',
			'department_1 on profile.department1_id = department_1.id',
			'department_2 on profile.department2_id = department_2.id'
		].join(' left join '),

		where: [
			"profile.active = 'yes' and profile.faculty_listing_category = 'Researcher'"
		].join(' and '),

		order: 'last_name asc'

	}, function () {

		people = $('<div>');

		people.data('sort', function () {

		});

		$.each(this.serializeBy('id').results, function () {
			var person, pic, name, link, title;

			person = $('<div class=person></div>');

			link = LINK.replace('%s', this.first_name).replace('%s', this.last_name);

			name = $(NAME
				.replace('%s', link)
				.replace('%s', this.first_name)
				.replace('%s', this.last_name));

			title = $('<h4>' + this.title + '</h4>');

			person.append(name).append(title).click(function (event) {

				var href = $(this).find('a').attr('href');

				event.stopPropagation();

				// If this was a middle mouse button or Shift or Command click, open in a new window
				if (event.button === 1 ||
						(event.button === 0 &&
						(event.metaKey === true ||
							event.ctrlKey === true ||
							event.shiftKey === true))) {
					window.open(href);
					return false;
				} else {
					location.href = href;
				}
			});
			people.append(person);

			person.data('Departments', [this.department1, this.department2].join('; '));

			person.data('Emphases', [this.emphasis1, this.emphasis2, this.emphasis3].join('; '));

		});


		$(function () {
			$('#facultyListing3').replaceWith(people.attr('id', 'facultyListing'));
			

			// XXX If the adjustLayout function exists in the global scope, it means
			// that we're on one of the pages using the old, stupid 3 column layout
			// script. After a filter, we have to adjust the layout.
			//
			if (window.adjustLayout) {
				window.adjustLayout();
			}

		});

	});*/
}(jQuery));

