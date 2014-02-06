/*
 * Faculty Expertise Search
 * http://education.ucsb.edu/research-faculty/find-faculty-expert
 *
 * Copyright (c) 2014, Justin Force, Zhenya Frolov, and the UC Regents
 * Licensed under the BSD 3-Clause License
 */

/*jslint indent: 2, browser: true */
/*global jQuery, muster */

(function ($) {

	'use strict';

	var name, dept, spec, keyw, fieldset, people, departments, form, show, reset,
		BIO_LINK = '/research-faculty/bio?first=%s&last=%s';

	// Add String.trim method for clients that don't have it
	// 
	// More information at
	//	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
	//
	if (String.prototype.trim === undefined) {
		String.prototype.trim = function () {
			return this.replace(/^\s+/, '').replace(/\s+$/, '');
		};
	}

	// Cache people's names, titles and department ids. Use the person's profile id as the index.
	// Cache department names. Use the department's id as the index.
	//
	// XXX the reason that we use arrays here is that it's simpler to implement
	// and pretty performant to just iterate over the results of our queries once
	// and cram all of the results into these arrays, overwriting any existing
	// values. Sure, when we iterate over them latter we have to check whether
	// they're undefined first (the arrays can be created with "holes"), but
	// that's pretty cheap considering all the work it saves us up front and in
	// array maintenance.
	//
	people = [];
	departments = [];

	// present the results of a search
	//
	// (faculty name, title, departments, matching publications or keywords, etc.)
	//
	show = function (results) {

		// cache the selection and empty any current contents (old search results),
		// then append the preamble
		//
		var div = $('#facultyExpertiseSearchResults');
		div.empty();
		div.append(
			$('<p>').html(
				[
					"<em>Please note that faculty member skills aren't listed on their",
					' individual webpages and that the individual webpages may not', 
					' include every publication written by that scholar.</em>'
				].join('')
			)
		);

		// we deal with results as an array. If we get a single result, wrap it in an array.
		//
		if (!(results instanceof Array)) {
			results = [results];
		}

		// sort by last name
		//
		results = results.sort(function(a, b) {
			a = a.last_name.toLowerCase();
			b = b.last_name.toLowerCase();
			if (a < b) {
				return -1;
			} else if (a === b) {
				return 0;
			} else {
				return 1;
			}
		});

		// display each result
		//
		$.each(results, function () {

			// easier to handle displaying departments if they're arrays.
			//
			var depts = [];

			// only proceed if the result is defined (we have to handle arrays with undefined holes)
			//
			// XXX check that this is not equal to window because stupid IE will
			// point this at window if this is undefined. Stupid.
			//
			if (this && this !== window) {

				// either department may be blank, so we only put them in the array if
				// they exist, then join them with a delimiter
				//
				if (this.department1_id) {
					depts.push(departments[this.department1_id].name);
				}
				if (this.department2_id) {
					depts.push(departments[this.department2_id].name);
				}
				depts.join('; ');

				div.append(
					$('<div class=fesPerson>').append(
						$('<h3>').append(
							$('<a>').text(
								this.first_name + ' ' + this.last_name + ','
							).attr('href', BIO_LINK.replace(/%s/, this.first_name).replace(/%s/, this.last_name))
						)
					).append(
						$(' <h4> ' + this.title + '. ' + depts +'</h4>')
					)
				);
			}
		});

		// XXX If the adjustLayout function exists in the global scope, it
		// means that we're on one of the pages using the old, stupid 3 column
		// layout script. After a filter, we have to adjust the layout.
		//
		if (window.adjustLayout) {
			window.adjustLayout();
		}
	};


	// when a form element is used, reset the other elements; we don't support combinative searches
	//
	reset = function () {
		form.find('select:not(:focus)').find('option:first').attr('selected', 'selected');
		form.find('input:not(:focus)').val('');
	};



	////////////////////////////////////////////////////////////////////////////// 
	// build form
	////////////////////////////////////////////////////////////////////////////// 

	// build the form and cache form and fieldset selections
	//
	form = $('<form>').append(
		$('<fieldset>').append(
			$('<legend>').text('Find a Faculty Expert')
		)
	).submit(function (e) {
		e.preventDefault(); // don't allow the form to be submitted
	});
	fieldset = form.find('fieldset');

	// preamble
	//
	fieldset.append(
		$('<p>').text(
			[
				"The Gevirtz School faculty offers broad and deep knowledge about",
				" topics in education, teacher training, and counseling, clinical,",
				" and school psychology. Search the database below."
			].join('')
		)
	);


	// name search form
	//
	name = $('<label>').text('By Name').append(
		$('<br>')
	).append(
		$('<select>').append(
			$('<option>')
		)
	);
	fieldset.append(name);


	// department search form
	//
	dept = $('<label>').text('By Department').append(
		$('<br>')
	).append(
		$('<select>').append(
			$('<option>')
		)
	);
	fieldset.append(dept);


	// specialization search form
	//
	spec = $('<label>').text('By Specialization').append(
		$('<br>')
	).append(
		$('<select>').append(
			$('<option>')
		)
	);
	fieldset.append(spec);


	// publication or keyword search form
	//
	keyw = $('<label>').text('By Publication Title or Keyword (results will include every search term)').append(
		$('<br>')
	).append(
		$('<input>')
	).append(
		$('<button>').text('Search')
	);
	fieldset.append(keyw);

	// help text
	//
	fieldset.append(
		$('<p>').html(
			[
				'If you cannot find what you are looking for or wish to interview a',
				' faculty member, please contact',
				' Communications Coordinator George Yatchisin at ',
				' <a href="mailto:george@education.ucsb.edu">george@education.ucsb.edu</a>', 
				' or 805-893-5789.'
			].join('')
		)
	);


	////////////////////////////////////////////////////////////////////////////// 
	// populate drop-downs
	////////////////////////////////////////////////////////////////////////////// 
	//
	// We retrieve the departments first then the names upon completion of
	// departments so that we can maintain a list per department of its members.
	//
	////////////////////////////////////////////////////////////////////////////// 


	// populate department drop-down
	//
	muster('ggsedb').query({
		select: 'id, name',
		from: 'department_1'
	}, function () {
		var select = dept.find('select'); // cache select
		$.each(this.results, function () {

			// cache department name and keep a list of its members
			//
			departments[this.id] = {
				name: this.name,
				members: []
			};

			// append corresponding option to the select form element
			//
			select.append(
				$('<option value=' + this.id + '>').text(this.name)
			);
		});


		// populate name drop-down
		//
		muster('ggsedb').query({
			select: 'id, first_name, last_name, title, department1_id, department2_id',
			from: 'profile',
			where: "active = 'yes'",
			order: 'last_name asc'
		}, function () {
			var select = name.find('select'); // cache select
			$.each(this.results, function () {

				// cache person
				//
				people[this.id] = this;

				// add person to members list of each of their associated departments
				//
				if (this.department1_id) {
					departments[this.department1_id].members.push(this);
				}
				if (this.department2_id) {
					departments[this.department2_id].members.push(this);
				}

				// append corresponding option to the select form element
				//
				select.append(
					$('<option value=' + this.id + '>').text(this.last_name + ', ' + this.first_name)
				);
			});
		});
	});


	// populate specialization drop-down
	//
	muster('ggsedb').query({
		select: 'id, name',
		from: 'specialization_area',
		order: 'name asc'
	}, function () {
		var select = spec.find('select');
		$.each(this.results, function () {
			select.append(
				$('<option value=' + this.id + '>').text(this.name)
			);
		});
	});


	////////////////////////////////////////////////////////////////////////////// 
	// handle search events
	////////////////////////////////////////////////////////////////////////////// 

	// name drop-down change
	//
	name.change(function (e) {
		var id = $(e.target).val();

		// only proceed if id is something (blank means it's the default, blank option)
		//
		if (id) {
			show(people[id]);
		}

		reset();
	});


	// department drop-down change
	//
	dept.change(function (e) {
		var id = $(e.target).val();

		// only proceed if id is something (blank means it's the default, blank option)
		//
		if (id) {
			show(departments[id].members);
		}

		reset();
	});


	// specialization drop-down change
	//
	spec.change(function (e) {
		var id = $(e.target).val();

		if (!id) {
			return;
		} else {

			reset();

			muster('ggsedb').query({
				select: [
					'profile.id as pid',
					'first_name',
					'last_name',
					'title',
					'department1_id',
					'department2_id',
					'specialization_area.name'
				].join(','),
				from: [
					'profile',
					'specialization on profile.id = specialization.profile_id',
					'specialization_area on specialization_area.id = specialization.specialization_area_id'
				].join(' inner join '),
				where: "active = 'yes' and specialization_area.id = " + id,
				order: 'last_name asc'
			}, function () {
				show(this.serializeBy('pid').results);
			});
		}
	});

	// XXX call button.click on input.keydown == 'return' for IE8
	//
	keyw.find('input').keypress(function (e) {
		if (e.keyCode === 13) {
			keyw.find('button').click();
		}
	});

	// publication or keyword submit
	//
	keyw.find('button').click(function (e) {

		var nonAlphanum, terms, where, enable;

		// move focus to input so that it doesn't get reset
		//
		$(e.target).prev('input').focus();
		reset();


		// re-enable form
		//
		enable = function () {
			$(e.target).removeAttr('disabled').prev('input').removeAttr('disabled');
		};


		// disable form while we're working to prevent hammering
		//
		$(e.target).attr('disabled', 'disabled').prev('input').attr('disabled', 'disabled');


		// jslint doesn't like ^, but it's the best way to match non-alphanumeric
		// characters. Turn off its regex checks temporarily.
		//
		/*jslint regexp: true */
		nonAlphanum = /[^a-z\d]/g;
		/*jslint regexp: false */


		// Normalize all search terms to lowercase alphanumeric words;
		// remove problematic words which might match too many results;
		// split the terms into an array;
		// and sort them so that equivalent searches can be cached (the search
		// terms are in the same order).
		//
		terms = keyw.find('input').val()
			.toLowerCase()
			.replace(nonAlphanum, ' ')
			.replace(/\b(and|or|the|a|an|in|on|of|from|to)\b/g, '')
			.split(/\s/)
			.sort();

		// prune out empty words
		//
		terms = $.grep(terms, function (e) {
			return e.length > 0;
		});

		// remove duplicates
		//
		terms = (function () {
			var ret = [];
			$.grep(terms, function (e) {
				if (ret.indexOf(e) < 0) {
					ret.push(e);
					return true;
				} else {
					return false;
				}
			});
			return ret;
		}());

		// don't proceed if there are no usable search terms left. Remember to re-enable the form.
		//
		if (terms.length === 0) {
			enable();
			return;
		}

		//
		// STOP! You have to query the tables separately or the performance is
		// nightmarishly slow. Rather than registering custom events, just do the
		// simpler thing (if /slightly/ slower) and call one query at the end of
		// the other, assembling the data at the end of the second query.
		//

		where = [];
		$.each(terms, function () {
			var part = [
				"lower(title) like '%%s%'",
				"lower(category) like '%%s%'",
				"lower(publisher) like '%%s%'",
				"lower(authors) like '%%s%'"
			].join(' or ').replace(/%s/g, this);
			if (!isNaN(this)) {
				part += ' or "year" = ' + this;
			}
			where.push(part);
		});
		where = where.join(' and ');

		muster('ggsedb').query({
			select: 'profile_id, title',
			from: 'publications',
			where: "status = 'Published' and " + where
		}, function () {

			var results = [];

			$.each(this.results, function () {
				results[this.profile_id] = people[this.profile_id];
			});

			where = [];
			$.each(terms, function () {
				where.push("lower(faculty_skills) like '%" + this + "%'");
			});
			where = where.join(' and ');

			muster('ggsedb').query({
				select: 'profile_id,faculty_skills',
				from: 'skills',
				where: where
			}, function () {

				$.each(this.results, function () {
					results[this.profile_id] = people[this.profile_id];
				});

				show(results);
				enable();
			});
		});
	});


	////////////////////////////////////////////////////////////////////////////// 
	// inject dynamic content
	////////////////////////////////////////////////////////////////////////////// 

	$(function () {

		// append results area then form then prepend form so that the form can
		// never be submitted unless the results area is already there
		//
		$('#facultyExpertiseSearch').append(
			$('<div id=facultyExpertiseSearchResults>')
		).prepend(form);

	});

}(jQuery));

