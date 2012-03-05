(function(){

	function positionWrapper(wrapper,dropbox) {
		wrapper.css({'left' : dropbox.offset().left});
		wrapper.css({'margin-top' : -(wrapper.height() - 0)});
	}

	$.fn.dragtoshare = function(opts){

		var self = this;

		var wrapper = $('<div id="dts-pop-' + Math.round(Math.random() * 3000) + '" class="dts-popup" />');
		var close = $('<div class="close dts-close">&times;</div>');

		close.bind('click',function(){
			wrapper.fadeOut();
			wrapper.children('.dts-sharing-container').remove();
		});

		wrapper.append(close);
		wrapper.css({'display':'none'});

		self.after(wrapper);

		var opts = $.extend({
			type : 'both',
			onDrop : function(event, ui) {
				wrapper.fadeIn();
				positionWrapper(wrapper,self);
				//Populate the share dialog.
				ui.draggable.data('shareable').populateShare(self);
			}
		}, opts);

		var dropbox = {}
		dropbox.type = opts.type;
		dropbox.requires = [];
		self.data('dropbox',dropbox);

		var has_twitter = $('input[name="twitter-status"]').val();
		var has_facebook = $('input[name="facebook-status"]').val();

		switch(dropbox.type){
			case 'both':
				if(has_twitter == 1 && has_facebook == 1){
					dropbox.status = 'open';
				} else {
					if(has_twitter != 1){
						dropbox.requires.push('twitter');
					}
					if(has_facebook != 1){
						dropbox.requires.push('facebook');
					}
					dropbox.status = 'closed';
				}
				break;
			case 'twitter':
				if(has_twitter == 1){
					dropbox.status = 'open';
				} else {
					dropbox.status = 'closed';
					dropbox.requires.push('twitter');
				}
				break;
			case 'facebook':
				if(has_facebook == 1){
					dropbox.status = 'open';
				} else {
					dropbox.status = 'closed';
					dropbox.requires.push('facebook');
				}
				break;
		}

		if(dropbox.status == 'open'){

			this.removeClass('disabled');
			$('a.dts-' + dropbox.type + '-sync').remove();

			this.droppable({
				drop: function(event, ui){
					$('.dts-sharing-container').remove();
					$('.dts-popup').fadeOut();
					if(ui.draggable.data('shareable')){
						opts.onDrop(event,ui);
						self.trigger('dts.drop');
					}
				}
			});

		} else {

			this.addClass('disabled');

			$.each(dropbox.requires,function(index,obj){
				var subscr_button = $('<a href="' + $('input[name="' + obj + '-url"]').val() + '" class="btn">Sync ' + obj + '</a>');
				subscr_button.addClass('dts-' + obj + '-sync');
				subscr_button.setupshare({'type' : obj});
				self.append(subscr_button);
			});

		}

		return this;
	};

})();