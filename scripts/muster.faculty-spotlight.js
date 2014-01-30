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

 /*
(function ($) {
	'use strict';
	people = [];
	
	function output(peopleList){
		var container = document.getElementById("facultySpotlight");
		var person = peopleList[Math.floor(Math.random()*peopleList.length)];
		var div = document.createElement("div");
		div.innerHTML = person.toString();
		container.append(div);
	}
	
	
	//$("#facultySpotlight").append("TEST");
	//document.getElementById('facultySpotlight').innerHTML = '<b>this will appear bold</b>';
	
	muster('ggsedb').query({
		select: 'id, first_name, last_name, faculty_listing_category, biography',
		from: 'profile',
		where: 'id is not null',
		order: 'last_name asc'
	}, function () {
		people.push(this);
		//$("#facultySpotlight").append(this);
	});

	output(people);
}(jQuery));
*/
(function ($) {
var balls90 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90'];

function getNumbers() {
    var player1 = new Array();
    balls90.sort(function() {
        return Math.random() - .25
    });
    var cardContainer = document.getElementById("header-wrapper");
    for (var i = 1; i <= 12; i++) {
        player1.push(balls90[i]);
        var div = document.createElement("div");
        div.innerHTML = (balls90[i]);
        cardContainer.appendChild(div);
    }
}

getNumbers();

}(jQuery));
