/*!
 * Faculty Research Interests v1.0.2
 * http://education.ucsb.edu/research-faculty/research-interests
 *
 * Copyright (c) 2014, Justin Force, Zhenya Frolov and the Regents of the University of California
 * Licensed under the BSD 3-Clause License
 */

/*jslint browser: true, indent: 2 */
/*global jQuery, muster */

(function ($) {

	'use strict';

	var table, tbody; // point to the generated table

	/*
	 * Return true if the column contains the value. If column is null, all
	 * columns are checked.
	 *
	 * row:
	 *	 jQuery object containing the table row to be examined
	 *
	 * column:
	 *	 The label of the column to be examined. Matches the column display label
	 *	 defined in muster.toTable() (not the actual column name). If null, all
	 *	 columns are searched.
	 *
	 * caseInsensitive:
	 *	 Should the string match be case-insensitive? Defaults to true.
	 */
	function cellContains(row, column, val, caseInsensitive) {

		var index = table.find('th:contains(' + column + ')').index() + 1,
			text = row.find('td:nth-child(' + index + ')').text();

		if (caseInsensitive === undefined) {
			caseInsensitive = true;
		}

		if (caseInsensitive) {
			return text.toLowerCase().match(val.toLowerCase()) !== null;
		} else {
			return text.match(val) !== null;
		}
	}

	// Add a <select> which allows you to filter the results displayed
	function addFilter() {

		var filter,
			hiddenRows = $('<tbody>'), // A place to keep the rows that "hide" from the table
			form = $('<form><label for=friFilter>Filter by department and emphasis: <select id=friFilter></select></label></form>'),
			table = $('#facultyResearchInterests table');

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
					return cellContains($(this), 'Departments', 'CCSP');
				}
			},
			{
				label: ' &nbsp; &nbsp; Clinical Psychology',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Clinical Psychology');
				}
			},
			{
				label: ' &nbsp; &nbsp; School Psychology Credential',
				filter: function () {
					return cellContains($(this), 'Emphases', 'School Psychology Credential');
				}
			},
			{
				label: ' &nbsp; &nbsp; Counseling Psychology',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Counseling Psychology');
				}
			},
			{
				label: 'Department of Education',
				filter: function () {
					return cellContains($(this), 'Departments', 'EDUC');
				}
			}, 
			{
				label: ' &nbsp; &nbsp; Culture and Development',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Culture and Development');
				}
			}, 
			{
				label: ' &nbsp; &nbsp; Language and Literacy',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Language and Literacy');
				}
			}, 
			{
				label: ' &nbsp; &nbsp; Learning, Culture and Technology Studies',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Learning, Culture and Technology Studies');
				}
			}, 
			{
				label: ' &nbsp; &nbsp; Policy, Leadership and Research Methods',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Policy, Leadership and Research Methods');
				}
			}, 
			{
				label: ' &nbsp; &nbsp; Science and Mathematics Education',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Science and Mathematics Education');
				}
			}, 
			{
				label: ' &nbsp; &nbsp; Special Education, Disabilities &amp; Risk Studies',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Special Education, Disabilities & Risk Studies');
				}
			}, 
			{
				label: ' &nbsp; &nbsp; Teacher Education and Professional Development',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Teacher Education and Professional Development');
				}
			}, 
			{
				label: 'Teacher Education Program',
				filter: function () {
					return cellContains($(this), 'Departments', 'TEP');
				}
			},
			{
				label: ' &nbsp; &nbsp; Multiple Subject',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Multiple Subject');
				}
			},
			{
				label: ' &nbsp; &nbsp; Single Subject',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Single Subject');
				}
			},
			{
				label: ' &nbsp; &nbsp; Special Education Credential',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Special Education Credential');
				}
			},
			{
				label: ' &nbsp; &nbsp; Science/Math Initiative',
				filter: function () {
					return cellContains($(this), 'Emphases', 'Science/Math Initiative');
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
		table.before(form);

		/* When an option is selected, move all of the rows into the hidden table,
		 * then bring back the ones that match the filter defined by the option.
		 * Afterwards, we sort the table by Name by marking the header as unsorted
		 * (removing the sorted and rsorted classes) and then clicking it.
		 */
		filter.change(function () {
			var func = filter.find('option:selected').data('filter');

			if (func) {
				table.append(hiddenRows.append(tbody.find('tr')).find('tr').filter(func));
				table.find('th:contains(Name)').removeClass('sorted').removeClass('rsorted').click();
			}

			// If the adjustLayout function exists in the global scope, it means that
			// we're on one of the pages using the old, stupid 3 column layout
			// script. After a filter, we have to adjust the layout.
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
			'profile.title',
			'interest',
			'emphasis_type_1.name as emphasis1',
			'emphasis_type_2.name as emphasis2',
			'emphasis_type_3.name as emphasis3',
			'department_1.acronym as department1',
			'department_2.acronym as department2'
		].join(','),

		from: [
			// research_interests first because we don't want to include profiles,
			// emphases, etc. that don't have associated research interests.
			'research_interests',
			'profile on research_interests.profile_id = profile.id',
			'emphasis on emphasis.profile_id = profile.id',
			'emphasis_type_1 on emphasis.emphasis_type_id_1 = emphasis_type_1.id',
			'emphasis_type_2 on emphasis.emphasis_type_id_2 = emphasis_type_2.id',
			'emphasis_type_3 on emphasis.emphasis_type_id_3 = emphasis_type_3.id',
			'department_1 on profile.department1_id = department_1.id',
			'department_2 on profile.department2_id = department_2.id'
		].join(' left join '),

		where: [
			"profile.active = 'yes'"
		].join(' and '),

		order: 'last_name asc'
	},

		// query callback
		function () {
			this.serializeBy('id').toTable(
				[
					[

						'Name',
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

					['Title', 'title'],

					[
						'Research Interests',
						function () {
							if (this.interest instanceof Array) {
								return this.interest.join('; ');
							} else {
								return this.interest;
							}
						}
					],


					[
						'Emphases',
						function () {
							return [this.emphasis1, this.emphasis2, this.emphasis3].join('; ');
						}
					],

					[
						'Departments',
						function () {
							return $.unique([this.department1, this.department2]).join('; ');
						}
					]
				],

				//Populates <div id="facultyResearchInterests"></div>
				'#facultyResearchInterests',

				/* table post-processing callback
				 *
				 * Add the "sorted" class to the Name column, because that's how it's
				 * sorted by default. Also, trigger "muster_sorted" event, because it
				 * _is_ sorted.
				 *
				 * hide Emphases and Departments columns. They're for
				 * sorting/filtering; not displaying.
				 */
				function () {

					table = $('#facultyResearchInterests table');
					tbody = table.find('tbody');

					table.find('th:contains(Name)').addClass('sorted');
					$(window).trigger('muster_sorted');

					$.each(['Emphases', 'Departments'], function () {
						var index,
							th = $('#facultyResearchInterests th:contains(' + this + ')');
						index = th.index() + 1;
						th.hide().closest('table').find('tr td:nth-child(' + index + ')').hide();
					});

					addFilter();
				}
			);
		});

}(jQuery));

