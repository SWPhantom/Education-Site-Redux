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
    
    var $facultySpotlight;
    
    $(document).ready(muster('ggsedb').query({
        select: 'id, first_name, last_name, faculty_listing_category, biography',
        from: 'profile',
        where: 'id is not null'
    }, function () {
        
        var randomIndex, person, $spotlightContent;
        
        randomIndex = Math.floor(this.results.length * Math.random());
        person = this.results[randomIndex];
        
        $spotlightContent = $('<div>');
        $spotlightContent.append($('<h3>' + person.first_name + ' ' + person.last_name + '</h3>'));
        $spotlightContent.append($('<p>' + person.biography + '</p>'));
        
        $(function () {
            if ($facultySpotlight === undefined) {
                $facultySpotlight = $('#facultySpotlight');
            }
            $facultySpotlight.append($spotlightContent);
        });

    }))
}(jQuery));
