jQuery(document).ready(function(){
        /* For zebra striping */
        jQuery("table tr:nth-child(odd)").addClass("odd-row");
        /* For cell text alignment */
        jQuery("table td:first-child, table th:first-child").addClass("first");
        /* For removing the last border */
        jQuery("table td:last-child, table th:last-child").addClass("last");
});