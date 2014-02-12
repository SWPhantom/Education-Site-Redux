/*!
 * Faculty Listing Bio
 * http://education.ucsb.edu/research-faculty/bio
 * Accessible via http://education.ucsb.edu/research-faculty/faculty
 *
 * Copyright (c) 2014 Justin Force, Zhenya Frolov and the UC Regents
 * Licensed under the BSD 3-Clause License
 */
 

/*jslint browser: true, indent: 2 */
/*global jQuery, muster */

(function ($) {

	'use strict';

	var person, query, queries,
		$window = $(window),
		VITAE_PATH = 'https://education.ucsb.edu/drupal7/sites/default/files/faculty_vitae/%s.pdf',
		IMG = '<img src="https://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/%s.jpg" alt="%s %s %s"/>', 
		args = {};

	// add trim method to String prototype if it doesn't already exist (IE<9)
	//
	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+/, '').replace(/\s+$/, '');
		};
	}

	// Parse arguments. URL key=value pairs populate `args` with args[key] = value.
	//
	// `http://.../?first=Bob&last=Foo` yields `args = { first: 'Bob', last: 'Foo' }`
	//
	// N.B. does not handle multiple arguments with the same name. The last
	//			argument to appear is the one used. So `?first=Foo&first=Bar` will
	//			yield `args.first == 'Bar'`
	//
	//
	$.each(location.href.split('?')[1].split('&'), function () {
		var arg = this.split('=');
		args[arg[0]] = window.unescape(arg[1]);
	});


	/////////////////////////////////////////////////////////////////////////////
	// helper functions
	/////////////////////////////////////////////////////////////////////////////

	/*
	 * return a link to uri with text as label as a jQuery object
	 */
	function link(uri, text) {
		if (uri && text) {
			return $('<a href="%s">%s</a>'.replace('%s', uri).replace('%s', text));
		} else {
			return null;
		}
	}

	function altNameTitle(attempt, backup) {
		if(attempt === undefined){
			return backup;
		}else{
			return attempt;
		}
	}

	/*
	 * return a set of 9 digits as a (123) 456-7890 phone number
	 */
	function phone(num) {
		if (num) {

			// (Tell JSLint to look away. /[^\d]/g really is the simplest and clearest
			// way to say "everything but numbers")
			//
			/*jslint regexp: true */
			var ret = num.replace(/[^\d]/g, '').replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, '($1) $2-$3');
			/*jslint regexp: false */
			return ret;
		} else {
			return null;
		}
	}

	/*
	 * return the appropriate link for the given department as a jQuery object
	 */
	function departmentLink(dept) {
		var depts = {

				'Department of Education':
					'/education',

				'Department of Counseling, Clinical & School Psychology':
					'/ccsp',

				'Teacher Education Program':
					'/tep'
			};

		if (!depts[dept]) {
			return;
		} else {
			return link(depts[dept], dept);
		}
	}

	/* Add a definition to `dl` defined as an array `def` of the form 
	 *
	 *	 [
	 *		 'Text for Term'
	 *		 'text, jQuery element or array of text and/or elements for definition'
	 *	 ]
	 */
	function addDefinition(dl, def) {
		var label = def[0],
			value = def[1];

		// just return if value appears to be blank
		if (!value) {
			return;
		}

		// if value isn't an array, put it in an array
		if (!(value instanceof Array)) {
			value = [value];
		}

		// prune empty values
		value = $.grep(value, function (e) { return e; });

		// if the value array is empty, just return
		if (value.length === 0) {
			return;
		}

		// if we made it this far, there is data to be displayed so set the dt
		dl.append($('<dt>').append(label));

		$.each(value, function () {
			if (this) {
				if (this instanceof String || typeof this === 'string') {

					// XXX Have to handle strings separately because IE is awful. Can't
					// use $('<dd>').text(this) because IE is really, really awful.
					//
					dl.append($('<dd id="' + label + '">' + this + '</dd>'));
				} else {
					dl.append($('<dd id="' + label + '">').append(this));
				}
			}
		});
	}

	/*
	 * return the list of publications as an array of html strings, each
	 * representing one publication
	 */
	function publications(pubs) {
		var ret = [];

		function publication(pub) {
			var text = [];
			if (pub.authors) {
				text.push(pub.authors.trim().replace(/\.$/, ''));
			}
			if (pub.title) {
				text.push('"' + pub.title.trim() + '"');
			}
			if (pub.publisher) {
				text.push('<em>' + pub.publisher.trim() + '</em>');
			}
			if (pub.year) {
				text.push(pub.year.trim());
			}
			if (pub.category) {
				text.push('[' + pub.category.trim() + ']');
			}
			return text.join('. ');
		}

		$.each(pubs, function () {
			if (this) {
				ret.push(publication(this));
			}
		});

		if (ret.length === 0) {
			return null;
		} else {
			return ret;
		}
	}

	/*
	 * return the list of awards as an array of html strings, each representing
	 * one award
	 */
	function awards(aws) {
		var ret = [];

		function award(aw) {
			var text = aw.award.trim();
			if (aw.year_awarded) {
				text += ', ' + aw.year_awarded.trim();
			}
			return text;
		}

		$.each(aws, function () {
			if (this) {
				ret.push(award(this));
			}
		});

		if (ret.length === 0) {
			return null;
		} else {
			return ret;
		}
	}

	/*
	 * return the list of presentations as an array of html strings, each representing
	 * one award
	 */
	function presentations(input) {
		var ret = [];

		function presentation(aw) {
			var text = aw.title.trim();
			if (aw.year) {
				text += ', ' + aw.year.trim();
			}
			return text;
		}

		$.each(input, function () {
			if (this) {
				ret.push(presentation(this));
			}
		});

		if (ret.length === 0) {
			return null;
		} else {
			return ret;
		}
	}

	function populatePage(person) {

		// These variables can be reused for each column
		var column, dl, pic;

		column = $('<div>');
		dl = $('<dl>');

		column.append(dl);

		$.each(
		[
			[
				'Name',
				[
					'<b>' + altNameTitle(person.display_name, person.first_name) + ' '+ person.last_name + '</b>'
				]
			],
			[
				'Title',
				[
					altNameTitle(person.working_title, person.title)
				]
			],
			[
				'Dept',
				[departmentLink(person.department1), departmentLink(person.department2)]
			],
			[
				'Sites',
				[
					link(person.personal_website, 'Personal Website'),
					link(person.group_research_website, 'Group Research Website'),
					link(person.vitae, 'Vitae')
				]
			],
			[
				'Room',
				person.office_room_number
			],
			[
				'Phone',
				phone(person.phone)
			],
			[
				'Email',
				link('mailto:' + person.email, person.email)
			]
		], function () {
			addDefinition(dl, this);
		});

		// Insert the column content when the page loads
		$(function () {
			$('#musterInfoContent').append(column.children());
		});


		// Populate center column
		//
		column = $('<div>');
		dl = $('<dl>');
		var tempName;
		var tempTitle;
		if(person.display_name === undefined){
			tempName = person.first_name;
		}else{
			tempName = person.display_name;
		}
		
		if(person.working_title === undefined){
			tempTitle = person.title;
		}else{
			tempTitle = person.working_title;
		}
		column
			.append($('<h1 class=header></h1>').text(tempName + ' ' + person.last_name))
			.append($('<h3 class=Paltino14pxBlackBold></h3>').text(tempTitle + ', ' + person.education))
			.append(dl);

		$.each(


		[
			[
				'Emphasis:',
				person.emphases
			],
			[
				'Research Interests:',
				person.research_interests
			],
			[
				'Biography:',
				person.biography
			],
			[
				'Awards and Honors:',
				person.awards
			],
			[
				'Affiliations:',
				person.affiliations
			],
			[
				'Lectures and Papers Presented:',
				person.presentations
			],
			[
				'Publications:',
				person.publications
			]
			
		]
		
		,function () {
			addDefinition(dl, this);
		});

		// Insert the column content when the page loads
		$(function () {
			$('#musterDataContent').append(column.children());
		});

		// Populate right column
		//
		column = $('<div>');

		// Tell JSLint to look away. /[^a-z]/g really is the simplest and
		// clearest way to say "letters only."
		//
		/*jslint regexp: true */
		pic = $(IMG
			.replace('%s', (person.first_name + person.last_name).toLowerCase().replace(/[^a-z]/g, ''))
			.replace('%s', person.working_title)
			.replace('%s', person.first_name)
			.replace('%s', person.last_name));
		/*jslint regexp: false */

		// Show a place holder if the image doesn't exist
		pic.bind('error', function () {
			this.src = 'https://education.ucsb.edu/drupal7/sites/default/files/faculty_photos/faculty-placeholder.gif';
		});

		column.append(pic);

		// Insert the column content when the page loads
		$(function () {
			$('#musterPictureContent').append(column.children());
		});


	//Taken from http://stackoverflow.com/questions/4478122/jquery-expand-collapse-all-dt-tags-in-definition-list-dl
	$('dt').click(function(e){
		// All dt elements after this dt element until the next dt element
		// Will be hidden or shown depending on it's current visibility
		$(this).nextUntil('dt').toggle();
	});
	}


	/////////////////////////////////////////////////////////////////////////////
	// Event handling matrix
	/////////////////////////////////////////////////////////////////////////////
	// The page depends on the results of several JSONP queries. Some depend upon
	// others. These events will enable each query to notify its dependent
	// actions when it's finished, so everything can do its own thing
	// asynchronously and we can assemble the results when all of the queries
	// have finished.
	/////////////////////////////////////////////////////////////////////////////
	//
	queries = {
		researchInterests: false,
		department1: false,
		department2: false,
		emphasis: false,
		publications: false,
		presentations: false,
		awards_and_honors: false,
		affiliations: false,
		education: false
	};

	function queryFinished(query) {
		return function () {
			queries[query] = true;
			$window.trigger('query_finished');
		};
	}

	for (query in queries) {
		if (queries.hasOwnProperty(query)) {
			$window.bind(query, queryFinished(query));
		}
	}

	$window.bind('query_finished', function () {
		var query;
		for (query in queries) {
			if (queries.hasOwnProperty(query)) {
				if (!queries[query]) {
					return;
				}
			}
		}
		$window.trigger('all_finished');
	});

	$window.bind('all_finished', function () {
		populatePage(person);
	});

	//////////////////////////////////////////////////////////////////////////////
	// Primary Query
	//////////////////////////////////////////////////////////////////////////////
	// The primary query for the profile. This gets the person and then
	// performies each of the additional queries as needed. Each subsequent query
	// is labeled with the event that it calls upon completion.
	//////////////////////////////////////////////////////////////////////////////
	muster('ggsedb').query({
		select: '*',
		from: 'profile',
		where: "active = 'yes' and first_name = '%s' and last_name = '%s'".replace(/%s/, args.first).replace(/%s/, args.last)
	}, function () {

		person = this.results[0];

		// If nobody with this name was found, notify the user and redirect back to the faculty listing
		//
		if (!person) {
			$(function () {
				$('#musterDataContent').html([
					'Could not find bio for <strong>',
					args.first,
					args.last,
					'</strong>. Redirecting back to Faculty Listing...'
				].join(' '));
				setTimeout(function () {
					location.href = '/research-faculty/faculty';
				}, 1000);
			});
			return;
		}

		// set vitae path. This isn't stored in the database and must be calculated.
		//
		/*jslint regexp: true */
		person.vitae = VITAE_PATH
			.replace('%s', (person.first_name + person.last_name)
				.toLowerCase()
				.replace(/[^a-z]/g, ''));
		/*jslint regexp: false */
		if (!person.vitae_available) {
			person.vitae = undefined;
		}


		// education
		//
		muster('ggsedb').query({
			select: 'degree,institution',
			from: 'education',
			where: 'profile_id = ' + person.id,
			order: '"year" desc',
			limit: '1'
		}, function () {
			var ed = this.results[0];
			person.education = '%d (%i)'.replace(/%d/, ed.degree).replace(/%i/, ed.institution);
			$window.trigger('education');
		});

		// departments
		//
		// Since there's no join table, we have to run a query per department. to
		// simplify this, use an array [1,2], but the "finished" events are still
		// department1 and department2.
		//
		$.each([1, 2], function () {
			var n = this,
				dept_id = person['department' + n + '_id'];

			if (!dept_id) {
				$window.trigger('department' + n);
				return;
			}
			muster('ggsedb').query({
				select: 'department_%d.name'.replace(/%d/, n),
				from: 'department_%d'.replace(/%d/, n),
				where: 'department_%d.id = %s'.replace(/%d/, n).replace(/%s/, dept_id)
			}, function () {
				person['department' + n] = (this.results[0] ? this.results[0].name : void 0);
				$window.trigger('department' + n);
			});
		});


		// emphasis
		//
		muster('ggsedb').query({
			select: [
				'emphasis_type_1.name as emphasis1',
				'emphasis_type_2.name as emphasis2',
				'emphasis_type_3.name as emphasis3'
			].join(','),
			from: [
				'emphasis',
				'emphasis_type_1 on emphasis.emphasis_type_id_1 = emphasis_type_1.id',
				'emphasis_type_2 on emphasis.emphasis_type_id_2 = emphasis_type_2.id',
				'emphasis_type_3 on emphasis.emphasis_type_id_3 = emphasis_type_3.id'
			].join(' left join '),
			where: 'emphasis.profile_id = ' + person.id
		}, function () {
			var emphasis = this.results[0];
			if (emphasis) {
				person.emphasis = $.grep([
					emphasis.emphasis1,
					emphasis.emphasis2,
					emphasis.emphasis3
				], function (e) { return e; }).join(', ');
			}

			$window.trigger('emphasis');
		});

		// researchInterests
		//
		muster('ggsedb').query({
			select: 'interest',
			from: 'research_interests',
			where: 'profile_id = ' + person.id
		}, function () {
			var interests = [];
			$.each(this.results, function () {
				if (this.interest) {
					interests.push(this.interest);
				}
			});
			person.research_interests = $.grep(interests, function (e) { return e; }).join('; ');
			$window.trigger('researchInterests');
		});

		// publications
		//
		// We try to get the publications that have been selected for display by
		// the faculty. If none are found, we just show the 5 most recent
		// publications.
		//
		muster('ggsedb').query({
			select: 'authors,title,publisher,"year",category',
			from: 'publications',
			//used to be: where: "faculty_webpage = '1' and status = 'Published' and publications.profile_id = " + person.id,
			where: "status = 'Published' and publications.profile_id = " + person.id,
			order: '"year" desc,publication_id desc'
		}, function () {
			if (this.results.length > 0) {
				person.publications = publications(this.results);
				$window.trigger('publications');
			} else {
				muster('ggsedb').query({
					select: 'authors,title,publisher,"year",category',
					from: 'publications',
					where: "status = 'Published' and profile_id = " + person.id,
					order: '"year" desc,publication_id desc'
				}, function () {
					person.publications = publications(this.results);
					$window.trigger('publications');
				});
			}
		});

		// awards and honors
		//
		muster('ggsedb').query({
			select: 'award,year_awarded',
			from: 'awards_and_honors',
			where: [
				'(year_awarded is null or year_awarded >= ',
				(new Date()).getFullYear() - 5,
				') and profile_id = ',
				person.id
			].join(''),
			order: 'year_awarded desc'
		}, function () {
			person.awards = awards(this.results);
			$window.trigger('awards_and_honors');
		});

		// presentations
		//
		muster('ggsedb').query({
			select: '*',
			from: 'lectures_papers_presented',
			where: 'title is not null and profile_id = ' + person.id,
			order: '"year" desc'
		}, function () {
			person.presentations = presentations(this.results);
			$window.trigger('presentations');
		});

		// affiliations
		//
		muster('ggsedb').query({
			select: 'professional_affiliations',
			from: 'professional_organizations_affiliations',
			where: 'profile_id = ' + person.id
		}, function () {
			var affiliations = [];
			$.each(this.results, function () {
				if (this.professional_affiliations) {
					affiliations.push(this.professional_affiliations.trim());
				}
			});
			if (affiliations.length === 0) {
				affiliations = null;
			}
			person.affiliations = affiliations;

			$window.trigger('affiliations');
		});
	});
	
}(jQuery));
