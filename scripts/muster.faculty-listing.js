/*!
 * Faculty Listing
 * http://education.ucsb.edu/research-faculty/faculty
 *
 * Copyright (c) 2014 Justin Force, Zhenya Frolov, and the UC Regents
 * Licensed under the BSD 3-Clause License
 */

/*jslint browser: true, indent: 2 */
/*global jQuery, muster */

(function ($) {
	'use strict';

	var initialArgument,
	hidden_people,
	people_senate,
	people_lacts,
	people_researchers,
	LINK = "/research-faculty/bio?first=%s&last=%s",
	NAME = '<h3><a href="%s">%s <span class=surname>%s</span></a></h3>',
	IMG = '<img src="https://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/%s.jpg" alt="%s %s %s"/>';

	function personHas(person, field, value) {
		return person.data(field).match(value) !== null
	}

	/* Function checkHeading
	 *
	 * Checks the number of children a div with a specified name has.
	 * If there are no children, hide the h2 element with the same
	 * name (+ "H2") as the div.
	 */
	function checkHeading(name) {
		var peopleList = document.getElementById(name);
		var peopleHeading = document.getElementById(name + "H2");
		if (peopleList.childNodes.length === 0) {
			$(peopleHeading).hide();
		} else {
			$(peopleHeading).show();
		}
	}

	/* Function checkArgugment
	 *
	 * Checks the argument text in the URL, which comes after
	 * the '?=' delimiter. Changes the select value and filters
	 * the list initially.
	 */
	function checkArgument() {
		var delimiter = '?=';
		initialArgument = (document.URL.split(delimiter)[1]);
		if (initialArgument.indexOf("ccsp") > -1) {
			//Select "Department of Counsling..." from the dropdown.
			$("#friFilter").val("Department of Counseling, Clinical & School Psychology");
			$('#friFilter').change();
		} else if (initialArgument.indexOf("educ") > -1) {
			//Select "Department of Education" from the dropdown.
			$("#friFilter").val("Department of Education");
			$('#friFilter').change();
		} else {
			//Do nothing.
		}
	}

	// Add a <select> which allows you to filter the results displayed
	function addFilter() {
		var filter,
		//hiddenPeople = $('<div>'), // A place to keep the rows that "hide" from the table
		form = $('<form><label for=friFilter>Filter by department and emphasis: <select id=friFilter></select></label></form>');
		filter = form.find('select');
		
		$.each([{
			label: '-- Show All --',
			filter: function () {
				return true;
			}
		}, {
			label: 'Department of Counseling, Clinical & School Psychology',
			filter: function () {
				return personHas($(this), 'Departments', 'CCSP');
			}
		}, {
			label: ' &nbsp; &nbsp; Clinical Psychology',
			filter: function () {
				return personHas($(this), 'Emphases', 'Clinical Psychology');
			}
		}, {
			label: ' &nbsp; &nbsp; School Psychology Credential',
			filter: function () {
				return personHas($(this), 'Emphases', 'School Psychology Credential');
			}
		}, {
			label: ' &nbsp; &nbsp; Counseling Psychology',
			filter: function () {
				return personHas($(this), 'Emphases', 'Counseling Psychology');
			}
		}, {
			label: 'Department of Education',
			filter: function () {
				return personHas($(this), 'Departments', 'EDUC');
			}
		}, {
			label: ' &nbsp; &nbsp; Culture and Development',
			filter: function () {
				return personHas($(this), 'Emphases', 'Culture and Development');
			}
		}, {
			label: ' &nbsp; &nbsp; Language and Literacy',
			filter: function () {
				return personHas($(this), 'Emphases', 'Language and Literacy');
			}
		}, {
			label: ' &nbsp; &nbsp; Learning, Culture and Technology Studies',
			filter: function () {
				return personHas($(this), 'Emphases', 'Learning, Culture and Technology Studies');
			}
		}, {
			label: ' &nbsp; &nbsp; Policy, Leadership and Research Methods',
			filter: function () {
				return personHas($(this), 'Emphases', 'Policy, Leadership and Research Methods');
			}
		}, {
			label: ' &nbsp; &nbsp; Science and Mathematics Education',
			filter: function () {
				return personHas($(this), 'Emphases', 'Science and Mathematics Education');
			}
		}, {
			label: ' &nbsp; &nbsp; Special Education, Disabilities &amp; Risk Studies',
			filter: function () {
				return personHas($(this), 'Emphases', 'Special Education, Disabilities & Risk Studies');
			}
		}, {
			label: ' &nbsp; &nbsp; Teacher Education and Professional Development',
			filter: function () {
				return personHas($(this), 'Emphases', 'Teacher Education and Professional Development');
			}
		}, {
			label: 'Teacher Education Program',
			filter: function () {
				return personHas($(this), 'Departments', 'TEP');
			}
		}, {
			label: ' &nbsp; &nbsp; Multiple Subject',
			filter: function () {
				return personHas($(this), 'Emphases', 'Multiple Subject');
			}
		}, {
			label: ' &nbsp; &nbsp; Single Subject',
			filter: function () {
				return personHas($(this), 'Emphases', 'Single Subject');
			}
		}, {
			label: ' &nbsp; &nbsp; Special Education Credential',
			filter: function () {
				return personHas($(this), 'Emphases', 'Special Education Credential');
			}
		}, {
			label: ' &nbsp; &nbsp; Science/Math Initiative',
			filter: function () {
				return personHas($(this), 'Emphases', 'Science/Math Initiative');
			}
		}], function () {

			// Attach the filter function to the <option> object and append the
			// <option> to the <select>
			filter.append(
			$('<option>' + this.label + '</option>').data('filter', this.filter));
		});

		// Insert the filter before the tables
		$('#formFilter').append(form);

		/* When an option is selected, move all of the rows into the hidden table,
		 * then bring back the ones that match the filter defined by the option.
		 * Afterwards, we sort the table by Name by marking the header as unsorted
		 * (removing the sorted and rsorted classes) and then clicking it.
		 */
		filter.change(function () {
			var func = filter.find('option:selected').data('filter');

			if (func) {
				// Move all people back into the hiddenPeople section
				//hiddenPeople.append(people.find('.person'));
				hidden_people.append(people_senate.find('.person'));
				hidden_people.append(people_lacts.find('.person'));
				hidden_people.append(people_researchers.find('.person'));

				//create list based selection filter
				var filtered = hidden_people.find('.person').filter(func).mergeSort(function (left, right) {
					left = $(left).find('h3 .surname').text();
					right = $(right).find('h3 .surname').text();
					if (left < right) {
						return -1;
					} else if (left === right) {
						return 0;
					} else {
						return 1;
					}
				});

				//people.append(filtered);
				people_senate.append(filtered.filter(function () {
					return personHas($(this), 'Category', 'Academic Senate Faculty')
				}));
				people_lacts.append(filtered.filter(function () {
					return personHas($(this), 'Category', 'Lecturer-Academic Coordinator-Teacher Supervisor')
				}));
				people_researchers.append(filtered.filter(function () {
					return personHas($(this), 'Category', 'Researcher')
				}));

				//Show/hide headings depending on whether the divs are populated.
				checkHeading("facultyListingSenate");
				checkHeading("facultyListingLACTS");
				checkHeading("facultyListingResearchers");

			}
		});
	}

	muster('ggsedb').query({
		select: [
			'profile.id', // needed for serialization
			'first_name',
			'last_name',
			'display_name',
			'profile.title',
			'profile.working_title',
			'emphasis_type_1.name as emphasis1',
			'emphasis_type_2.name as emphasis2',
			'emphasis_type_3.name as emphasis3',
			'department_1.acronym as department1',
			'department_2.acronym as department2',
			'profile.faculty_listing_category'].join(','),
		from: [
			'profile',
			'emphasis on emphasis.profile_id = profile.id',
			'emphasis_type_1 on emphasis.emphasis_type_id_1 = emphasis_type_1.id',
			'emphasis_type_2 on emphasis.emphasis_type_id_2 = emphasis_type_2.id',
			'emphasis_type_3 on emphasis.emphasis_type_id_3 = emphasis_type_3.id',
			'department_1 on profile.department1_id = department_1.id',
			'department_2 on profile.department2_id = department_2.id'].join(' left join '),
		where: [
			"profile.active = 'yes'"].join(' and '),
		order: 'last_name asc'

	}, function () {

		hidden_people = $('<div class="hidden">');
		people_senate = $('<div class="facultyListing">');
		people_lacts = $('<div class="facultyListing">');
		people_researchers = $('<div class="facultyListing">');

		hidden_people.data('sort', function () {});

		$.each(this.serializeBy('id').results, function () {
			var person, pic, name, link, work_title, isASF;

			person = $('<div class=person></div>');
			link = LINK.replace('%s', this.first_name).replace('%s', this.last_name);

			//Boolean that is used to see if the picture even needs to be GETed.
			isASF = this.faculty_listing_category === 'Academic Senate Faculty';

			if (isASF) {
				// JSLint doesn't like negations in regexp, but it really is the clearest
				// way to say "letters only". Below, we disable JSLint scrutiny of
				// regular expressions for just that line.
				/*jslint regexp: true */
				pic = $(IMG.replace('%s', (this.first_name + this.last_name).toLowerCase().replace(/[^a-z]/g, ''))
					.replace('%s', this.working_title)
					.replace('%s', this.first_name)
					.replace('%s', this.last_name));
				/*jslint regexp: false */

				// Show a place holder if the image doesn't exist
				pic.bind('error', function () {
					this.src = 'https://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/faculty-placeholder.gif'
				});
			}

			if (this.display_name === undefined) {
				name = $(NAME.replace('%s', link)
					.replace('%s', this.first_name)
					.replace('%s', this.last_name));
			} else {
				name = $(NAME.replace('%s', link)
					.replace('%s', this.display_name)
					.replace('%s', this.last_name));
			}
			if (this.working_title === undefined) {
				work_title = $('<h4>' + this.title + '</h4>');
			} else {
				work_title = $('<h4>' + this.working_title + '</h4>');
			}

			if (isASF) { //Insert picture into link before text.
				name.find('a').prepend(pic);
			}
			person.append(name).append(work_title).click(function (event) {
				var href = $(this).find('a').attr('href');
				event.stopPropagation();

				// If this was a middle mouse button or Shift or Command click, open in a new window
				if (event.button === 1 || (event.button === 0 && (event.metaKey === true || event.ctrlKey === true || event.shiftKey === true))) {
					window.open(href);
					return false;
				} else {
					location.href = href;
				}
			});

			hidden_people.append(person);
			person.data('Departments', [this.department1, this.department2].join('; '));
			person.data('Emphases', [this.emphasis1, this.emphasis2, this.emphasis3].join('; '));
			person.data('Category', this.faculty_listing_category);
		});

		$(function () {
			$('#facultyListingSenate').replaceWith(people_senate.attr('id', 'facultyListingSenate'));
			$('#facultyListingLACTS').replaceWith(people_lacts.attr('id', 'facultyListingLACTS'));
			$('#facultyListingResearchers').replaceWith(people_researchers.attr('id', 'facultyListingResearchers'));
			addFilter();
			$('#friFilter').change();
		});
		
		//Initialize the list with the given URL argument.
		checkArgument();
	});
}(jQuery));