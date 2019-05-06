(function ($) {
 "use strict";
 
	/*----------------------
		wizard
	 -----------------------*/
	 $('#rootwizard-1').bootstrapWizard({'nextSelector': '.button-next', 'previousSelector': '.button-previous', 'firstSelector': '.button-first', 'lastSelector': '.button-last'});
	 $('#rootwizard-2').bootstrapWizard({'nextSelector': '.button-next', 'previousSelector': '.button-previous', 'firstSelector': '.button-first', 'lastSelector': '.button-last'});
	 $('#rootwizard-3').bootstrapWizard({'nextSelector': '.button-next', 'previousSelector': '.button-previous', 'firstSelector': '.button-first', 'lastSelector': '.button-last'});
	
	$("body").on("click", ".a-prevent", function(e) {
            e.preventDefault();
        })
 
})(jQuery); 