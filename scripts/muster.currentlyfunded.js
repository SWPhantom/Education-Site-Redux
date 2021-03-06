/*!
 * The Gevirtz School Currently Funded Page v1.1.3
 * http://education.ucsb.edu/Faculty-Research/Research-Office/currentlyfunded.htm
 *
 * Copyright (c) 2011, Justin Force
 * Licensed under the BSD 3-Clause License
 */

/*jslint browser: true, indent: 2 */
/*global jQuery, muster */


(function ($) {

	'use strict';

	// XXX hack to work around Prototype's reckless manipulation of the Array prototype
	if (Array.prototype._reverse) {
		Array.prototype.reverse = Array.prototype._reverse;
	}

	/*
	 *function isString
	 *
	 * return true if candidate is a String. We use two tests due to inconsistent
	 * behavior in IE and Safari.
	 * Reference: http://stackoverflow.com/a/8220468/234242
	 */
	function isString(candidate) {
		if (typeof candidate === 'string' || candidate instanceof String) {
			return true;
		} else {
			return false;
		}
	}

	/*
	 * function bioLink
	 *
	 * Takes in a first and last name as strings and returns an
	 * html string in the following format:
	 * <a href=...first=first&last=last>last, first</a>
	 */
	function bioLink(last, first) {
		var link = $('<a>').attr('href', [
			'/research-faculty/bio?',
			'first=' + first,
			'&last=' + last].join(''));
		link.text(last + ', ' + first);
		return link;
	}

	/*
	 * function dollars
	 *
	 * Reverse the string, split it into chunks of 3 digis, join the chunks
	 * with commas, then reverse it again. Prepend a $ and return it.
	 */
	function dollars(amount) {
		var i, parts = [];
		amount = Array.prototype.reverse.call(amount.split('')).join('');
		for (i = 0; i < amount.length; i += 3) {
			parts.push(amount.slice(i, i + 3));
		}
		amount = Array.prototype.reverse.call(parts.join(',').split('')).join('');
		return '$' + amount;
	}

	muster('ggsedb').query({
		select: '*',
		from: 'grants_and_contracts, grants_and_contracts_lookup, profile',
		where: [
			'grant_closed is null',
			" and (grant_type = 'Grant' or grant_type = 'Income/MOU' or grant_type = 'Award')",
			' and grants_and_contracts_id = grants_and_contracts.id and profile_id = profile.id'].join(''),
		order: 'last_name asc'
	}, function () {
		this.serializeBy('id').toTable(
		// Column definitions: [format, label]
		[

		/*
		 * PI / Co-PI
		 *
		 * If there's only one value,
		 *	 "Lastname, Firstname"
		 * If there are two,
		 *	 "Lastone, Firstone / Lasttwo, Firsttwo"
		 */ [
			'PI / Co-PI',

		function () {
			var i, len, names, last_name;
			
			//If there are multiple instances of a first or last name, an array
			//is not created. Therefore, force all the deficient arrays to be
			//populated by the correct name.
			// XXX: Will have issues with more than one missing name.
			if (isString(this.last_name) && !isString(this.first_name)) {
				last_name = this.last_name;
				this.last_name = [];
				for (i = 0, len = this.first_name.length; i < len; i += 1) {
					this.last_name[i] = last_name;
				}
			}

			if (isString(this.first_name) && !isString(this.last_name)) {
				first_name = this.first_name;
				this.first_name = [];
				for (i = 0, len = this.last_name.length; i < len; i += 1) {
					this.first_name[i] = first_name;
				}
			}

			//Append to the table.
			if (isString(this.last_name)) { //There is one person associated with the grant.
				return bioLink(this.last_name, this.first_name);
			} else if (this.last_name instanceof Array) { //Multiple people associated.
				names = $('<div>');
				var hasPI = false;
				var PILocation;
				//Find the PI location in the array.
				for (i = 0; i < this.pi_type.length; ++i) {
					if (this.pi_type[i] === "PI") {
						hasPI = true;
						PILocation = i;
					}
				}

				//Proceed with the appending process.
                var counter = 0;
				if (hasPI === true) { //There is one PI
					names.append(bioLink(this.last_name[PILocation], this.first_name[PILocation]));
					names.append(' / ');
                    ++counter;
					for (i = 0; i < this.pi_type.length; ++i) {
						if (i !== PILocation) {
							names.append(bioLink(this.last_name[i], this.first_name[i]));
                            ++counter;
							if (counter !== this.pi_type.length) {
								names.append(' / ');
							}
						}
					}
				} else { //Everyone is a Co-PI
					for (i = 0; i < this.pi_type.length; ++i) {
						names.append(bioLink(this.last_name[i], this.first_name[i]));
                        ++counter;
						if (counter !== this.pi_type.length) {
							names.append(' / ');
						}
					}
				}
                
				return names.html();
			}
		}],

		/*
		 * Contract or Grant
		 *
		 * Show the title as an h3, then show all of the other attributes in the
		 * same cell in a definition list (dl). After the table is rendered,
		 * we'll use the callback to pull the definition list into a cell in its
		 * own row below the normal row. So a single row will become
		 *
		 * ---------------------------------------------------------------
		 * | PI / Co-PI                    | Grant or Contract
		 * ---------------------------------------------------------------
		 * | Baca, Michele / Force, Justin | Leaning to Yell at People
		 * ---------------------------------------------------------------
		 * | Year Begin: 2009    Year End: 2012    Amount: $1,210,000
		 * | Sponsor: Spite Itself
		 * | Abstract:
		 * | A bunch of shapes and colors that make you feel superior.
		 * ---------------------------------------------------------------
		 */ [
			'Contract or Grant',

		function () {
			var html, dl;

			html = $('<div>'); // wrap it for appending
			html.append(this.title);
			dl = $('<dl>');

			html.append(dl);

			if (this.year_begin) {
				dl.append('<dt class=yearBegin>Year Begin:</dt><dd>' + this.year_begin + '</dd>');
			}
			if (this.year_end) {
				dl.append('<dt class=yearEnd>Year End:</dt><dd>' + this.year_end + '</dd>');
			}
			if (this.award_amount) {
				dl.append('<dt class=amount>Amount:</dt><dd class=amount>' + dollars(this.award_amount) + '</dd>');
			}
			if (this.source) {
				dl.append('<dt class=sponsor>Sponsor:</dt><dd class=sponsor>' + this.source + '</dd>');
			}
			if (this.abstract) {
				dl.append('<dt class=abstract>Abstract:</dt><dd class=abstract>' + this.abstract + '</dd>');
			}
			return html.html(); // unwrap it
		}]],

		//Target container for table (<div id="currentlyFunded"></div>)
		'#currentlyFunded',

		/*
		 * callback toTable
		 *
		 * Post processing on the table. Since it's not entirely tabular, we need
		 * to pop out the definition list and put it on a new row, hide the row, and
		 * set the rows up to be opened and closed when the title is clicked.
		 *
		 * We also want to click the first header (th) once to sort by PI / Co-PI
		 */
		function () {
			var table = $(this),
				titles = table.find('*'),
				rows = table.find('tbody tr');

			rows.each(function () {
				var row = $(this),
					tr = $('<tr>'),
					td = $('<td colspan=2>'),
					h3 = row.find('*'),
					dl = row.find('dl');

				tr.append(td.append(dl));

				row.after(tr);

				h3.data('open', function (animate) {
					if (animate === undefined || animate === true) {
						dl.slideDown();
					} else {
						dl.show();
					}
				});

				h3.data('close', function (animate) {
					if (animate === undefined || animate === true) {
						dl.slideUp();
					} else {
						dl.hide();
					}
				});

				h3.click(function () {
					if (dl.is(':visible')) {
						h3.data('close').call();
					} else {
						h3.data('open').call();
					}
				});

				dl.hide();

				// When a the table is sorted, the supplementary rows that we just
				// added will not be considered. We need to put them back where they
				// belong after a sort is performed.
				$(window).bind('muster_sorted', function () {
					row.after(tr);
				});
			});

			// Click first header to sort by PI / Co-PI
			table.find('th:first').click();
		});
	});
}(jQuery));
