// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Command Bar Plugin
 */

(function ($) {
  $.fn.CommandBar = function () {

    var createMenuItem = function(text, icon, link) {
      var item = '<li class="ms-ContextualMenu-item"><a class="ms-ContextualMenu-link"" href="#">';
        item += text;
        item += '</a></li>';
        
      return item;
    }

    var saveCommands = function($commands, $commandWidth, $commandarea) {
      var commands = [];
      $commands.each(function(index) {
        var $Item = $(this);
        var $rightOffset = ($Item.offset().left + $Item.outerWidth() + $commandWidth + 10) - $commandarea.offset().left; // Added padding of 10
        commands.push({ jquery: $Item, rightOffset: $rightOffset});
      });
      return commands;
    }

    var processCommands = function(commands, width) {
        var overFlowCommands = [];

        for(var i=0; i < commands.length; i++) {
          var $Item = commands[i].jquery;
          var rightOffset = commands[i].rightOffset;
          
          // If the command is outside the right boundaries add to overflow items
          if(!$Item.hasClass('ms-CommandBarItem-overflow')) {
            if(rightOffset > width) {
              overFlowCommands.push($Item);
            } else {
              // Make sure item is displayed
              $Item.removeClass('hideCommand');
            }
          }
        }
        return overFlowCommands;
    }

    var processOverflow = function(overFlowCommands, $oCommand, $menu) {
        var overflowStrings = '';

        if(overFlowCommands.length > 0) {
          $oCommand.addClass("is-visible");
          // Empty menu
          $menu.html('');

          // Add overflowed commands to ContextualMenu

          for(i = 0; i < overFlowCommands.length; i++) {
            var $Item = $(overFlowCommands[i]);
            // Hide Element in CommandBar
            $Item.addClass('is-hidden');
            var commandBarItemText = $Item.find('.ms-CommandBarItem-commandText').text();
            overflowStrings += createMenuItem(commandBarItemText);
          }
          $menu.html(overflowStrings);
        } else {
          $oCommand.removeClass("is-visible");
        }
    }

    /** Go through each CommandBar we've been given. */
    return this.each(function () {
      var $CommandBar = $(this);
      var $CommandMainArea = $CommandBar.find('.ms-CommandBar-mainArea');
      var $CommandBarItems = $CommandMainArea.find('.ms-CommandBarItem');
      var $OverflowCommand = $CommandBar.find('.ms-CommandBarItem-overflow');
      var $OverflowCommandWidth = $CommandBar.find('.ms-CommandBarItem-overflow').outerWidth();
      var $OverflowMenu = $CommandBar.find('.ms-CommandBar-overflowMenu');
      var $SearchBox = $CommandBar.find('.ms-CommandBarSearch');
      var mobileSwitch = false;
      var overFlowCommands;
      var allCommands;

      // Go through process and save commands
      allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);

      // Initiate process commands and add commands to overflow on load
      overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth());
      processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

      // Add resize event handler on commandBar
      $(window).resize(function() {
        var overFlowCommands;
        overFlowCommands = processCommands(allCommands, $CommandMainArea.innerWidth());
        processOverflow(overFlowCommands, $OverflowCommand, $OverflowMenu);

        if($(window).width() < 640 && mobileSwitch == false) {
          allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);
          mobileSwitch = true;
        } else if($(window).width() > 639 && mobileSwitch == true) {
          allCommands = saveCommands($CommandBarItems, $OverflowCommandWidth, $CommandMainArea);
          mobileSwitch = false;
        }
      });

      // Hook up contextual menu
      $OverflowCommand.click(function() {
        $OverflowMenu.toggleClass('is-open');
      });

      $SearchBox.find('.ms-CommandBarSearch-input').click(function() {
        $(this).closest('.ms-CommandBarSearch').addClass('ms-CommandBarSearch--active');
      });

       $SearchBox.keypress(function() {
        //Get Search Field
        var $input = $(this).find('.ms-CommandBarSearch-input');

        if($input.val()) {
          $(this).addClass('ms-CommandBarSearch--hasText');
        } else {
          $(this).removeClass('ms-CommandBarSearch--hasText');
        }
      });

      $SearchBox.find('.ms-CommandBarSearch-iconClearWrapper').click(function() {
        var $input = $(this).parent().find('.ms-CommandBarSearch-input');
        $input.val('');
        $input.parent().removeClass('ms-CommandBarSearch--hasText ms-CommandBarSearch--active');
      });
        
    });
  };
})(jQuery);
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Contextual Menu Plugin
 */
(function ($) {
  $.fn.ContextualMenu = function () {

    /** Go through each nav bar we've been given. */
    return this.each(function () {

      var $contextualMenu = $(this);


      // Set selected states.
      $contextualMenu.on('click', '.ms-ContextualMenu-link:not(.is-disabled)', function(event) {
        event.preventDefault();

        // Check if multiselect - set selected states
        if ( $contextualMenu.hasClass('ms-ContextualMenu--multiselect') ) {

          // If already selected, remove selection; if not, add selection
          if ( $(this).hasClass('is-selected') ) {
            $(this).removeClass('is-selected');
          }
          else {
            $(this).addClass('is-selected');
          }

        }
        // All other contextual menu variants
        else {

          // Deselect all of the items and close any menus.
          $('.ms-ContextualMenu-link')
              .removeClass('is-selected')
              .siblings('.ms-ContextualMenu')
              .removeClass('is-open');

          // Select this item.
          $(this).addClass('is-selected');

          // If this item has a menu, open it.
          if ($(this).hasClass('ms-ContextualMenu-link--hasMenu')) {
            $(this).siblings('.ms-ContextualMenu:first').addClass('is-open');

            // Open the menu without bubbling up the click event,
            // which can cause the menu to close.
            event.stopPropagation();
          }

        }


      });

    });
  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

!function(a){"function"==typeof define&&define.amd?define("picker",["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):this.Picker=a(jQuery)}(function(a){function b(f,g,h,k){function l(){return b._.node("div",b._.node("div",b._.node("div",b._.node("div",w.component.nodes(r.open),t.box),t.wrap),t.frame),t.holder)}function m(){u.data(g,w).addClass(t.input).val(u.data("value")?w.get("select",s.format):f.value).on("focus."+r.id+" click."+r.id,p),s.editable||u.on("keydown."+r.id,function(a){var b=a.keyCode,c=/^(8|46)$/.test(b);return 27==b?(w.close(),!1):void((32==b||c||!r.open&&w.component.key[b])&&(a.preventDefault(),a.stopPropagation(),c?w.clear().close():w.open()))}),e(f,{haspopup:!0,expanded:!1,readonly:!1,owns:f.id+"_root"+(w._hidden?" "+w._hidden.id:"")})}function n(){w.$root.on({focusin:function(a){w.$root.removeClass(t.focused),a.stopPropagation()},"mousedown click":function(b){var c=b.target;c!=w.$root.children()[0]&&(b.stopPropagation(),"mousedown"!=b.type||a(c).is(":input")||"OPTION"==c.nodeName||(b.preventDefault(),f.focus()))}}).on("click","[data-pick], [data-nav], [data-clear], [data-close]",function(){var b=a(this),c=b.data(),d=b.hasClass(t.navDisabled)||b.hasClass(t.disabled),e=document.activeElement;e=e&&(e.type||e.href)&&e,(d||e&&!a.contains(w.$root[0],e))&&f.focus(),!d&&c.nav?w.set("highlight",w.component.item.highlight,{nav:c.nav}):!d&&"pick"in c?w.set("select",c.pick).close(!0):c.clear?w.clear().close(!0):c.close&&w.close(!0)}),e(w.$root[0],"hidden",!0)}function o(){var b;s.hiddenName===!0?(b=f.name,f.name=""):(b=["string"==typeof s.hiddenPrefix?s.hiddenPrefix:"","string"==typeof s.hiddenSuffix?s.hiddenSuffix:"_submit"],b=b[0]+f.name+b[1]),w._hidden=a('<input type=hidden name="'+b+'"'+(u.data("value")||f.value?' value="'+w.get("select",s.formatSubmit)+'"':"")+">")[0],u.on("change."+r.id,function(){w._hidden.value=f.value?w.get("select",s.formatSubmit):""}).after(w._hidden)}function p(a){a.stopPropagation(),"focus"==a.type&&w.$root.addClass(t.focused),w.open()}if(!f)return b;var q=!1,r={id:f.id||"P"+Math.abs(~~(Math.random()*new Date))},s=h?a.extend(!0,{},h.defaults,k):k||{},t=a.extend({},b.klasses(),s.klass),u=a(f),v=function(){return this.start()},w=v.prototype={constructor:v,$node:u,start:function(){return r&&r.start?w:(r.methods={},r.start=!0,r.open=!1,r.type=f.type,f.autofocus=f==document.activeElement,f.readOnly=!s.editable,f.id=f.id||r.id,"text"!=f.type&&(f.type="text"),w.component=new h(w,s),w.$root=a(b._.node("div",l(),t.picker,'id="'+f.id+'_root"')),n(),s.formatSubmit&&o(),m(),s.container?a(s.container).append(w.$root):u.after(w.$root),w.on({start:w.component.onStart,render:w.component.onRender,stop:w.component.onStop,open:w.component.onOpen,close:w.component.onClose,set:w.component.onSet}).on({start:s.onStart,render:s.onRender,stop:s.onStop,open:s.onOpen,close:s.onClose,set:s.onSet}),q=c(w.$root.children()[0]),f.autofocus&&w.open(),w.trigger("start").trigger("render"))},render:function(a){return a?w.$root.html(l()):w.$root.find("."+t.box).html(w.component.nodes(r.open)),w.trigger("render")},stop:function(){return r.start?(w.close(),w._hidden&&w._hidden.parentNode.removeChild(w._hidden),w.$root.remove(),u.removeClass(t.input).removeData(g),setTimeout(function(){u.off("."+r.id)},0),f.type=r.type,f.readOnly=!1,w.trigger("stop"),r.methods={},r.start=!1,w):w},open:function(c){return r.open?w:(u.addClass(t.active),e(f,"expanded",!0),setTimeout(function(){w.$root.addClass(t.opened),e(w.$root[0],"hidden",!1)},0),c!==!1&&(r.open=!0,q&&j.css("overflow","hidden").css("padding-right","+="+d()),u.trigger("focus"),i.on("click."+r.id+" focusin."+r.id,function(a){var b=a.target;b!=f&&b!=document&&3!=a.which&&w.close(b===w.$root.children()[0])}).on("keydown."+r.id,function(c){var d=c.keyCode,e=w.component.key[d],g=c.target;27==d?w.close(!0):g!=f||!e&&13!=d?a.contains(w.$root[0],g)&&13==d&&(c.preventDefault(),g.click()):(c.preventDefault(),e?b._.trigger(w.component.key.go,w,[b._.trigger(e)]):w.$root.find("."+t.highlighted).hasClass(t.disabled)||w.set("select",w.component.item.highlight).close())})),w.trigger("open"))},close:function(a){return a&&(u.off("focus."+r.id).trigger("focus"),setTimeout(function(){u.on("focus."+r.id,p)},0)),u.removeClass(t.active),e(f,"expanded",!1),setTimeout(function(){w.$root.removeClass(t.opened+" "+t.focused),e(w.$root[0],"hidden",!0)},0),r.open?(r.open=!1,q&&j.css("overflow","").css("padding-right","-="+d()),i.off("."+r.id),w.trigger("close")):w},clear:function(a){return w.set("clear",null,a)},set:function(b,c,d){var e,f,g=a.isPlainObject(b),h=g?b:{};if(d=g&&a.isPlainObject(c)?c:d||{},b){g||(h[b]=c);for(e in h)f=h[e],e in w.component.item&&(void 0===f&&(f=null),w.component.set(e,f,d)),("select"==e||"clear"==e)&&u.val("clear"==e?"":w.get(e,s.format)).trigger("change");w.render()}return d.muted?w:w.trigger("set",h)},get:function(a,c){if(a=a||"value",null!=r[a])return r[a];if("value"==a)return f.value;if(a in w.component.item){if("string"==typeof c){var d=w.component.get(a);return d?b._.trigger(w.component.formats.toString,w.component,[c,d]):""}return w.component.get(a)}},on:function(b,c,d){var e,f,g=a.isPlainObject(b),h=g?b:{};if(b){g||(h[b]=c);for(e in h)f=h[e],d&&(e="_"+e),r.methods[e]=r.methods[e]||[],r.methods[e].push(f)}return w},off:function(){var a,b,c=arguments;for(a=0,namesCount=c.length;namesCount>a;a+=1)b=c[a],b in r.methods&&delete r.methods[b];return w},trigger:function(a,c){var d=function(a){var d=r.methods[a];d&&d.map(function(a){b._.trigger(a,w,[c])})};return d("_"+a),d(a),w}};return new v}function c(a){var b,c="position";return a.currentStyle?b=a.currentStyle[c]:window.getComputedStyle&&(b=getComputedStyle(a)[c]),"fixed"==b}function d(){if(j.height()<=h.height())return 0;var b=a('<div style="visibility:hidden;width:100px" />').appendTo("body"),c=b[0].offsetWidth;b.css("overflow","scroll");var d=a('<div style="width:100%" />').appendTo(b),e=d[0].offsetWidth;return b.remove(),c-e}function e(b,c,d){if(a.isPlainObject(c))for(var e in c)f(b,e,c[e]);else f(b,c,d)}function f(a,b,c){a.setAttribute(("role"==b?"":"aria-")+b,c)}function g(b,c){a.isPlainObject(b)||(b={attribute:c}),c="";for(var d in b){var e=("role"==d?"":"aria-")+d,f=b[d];c+=null==f?"":e+'="'+b[d]+'"'}return c}var h=a(window),i=a(document),j=a(document.documentElement);return b.klasses=function(a){return a=a||"picker",{picker:a,opened:a+"--opened",focused:a+"--focused",input:a+"__input",active:a+"__input--active",holder:a+"__holder",frame:a+"__frame",wrap:a+"__wrap",box:a+"__box"}},b._={group:function(a){for(var c,d="",e=b._.trigger(a.min,a);e<=b._.trigger(a.max,a,[e]);e+=a.i)c=b._.trigger(a.item,a,[e]),d+=b._.node(a.node,c[0],c[1],c[2]);return d},node:function(b,c,d,e){return c?(c=a.isArray(c)?c.join(""):c,d=d?' class="'+d+'"':"",e=e?" "+e:"","<"+b+d+e+">"+c+"</"+b+">"):""},lead:function(a){return(10>a?"0":"")+a},trigger:function(a,b,c){return"function"==typeof a?a.apply(b,c||[]):a},digits:function(a){return/\d/.test(a[1])?2:1},isDate:function(a){return{}.toString.call(a).indexOf("Date")>-1&&this.isInteger(a.getUTCDate())},isInteger:function(a){return{}.toString.call(a).indexOf("Number")>-1&&a%1===0},ariaAttr:g},b.extend=function(c,d){a.fn[c]=function(e,f){var g=this.data(c);return"picker"==e?g:g&&"string"==typeof e?b._.trigger(g[e],g,[f]):this.each(function(){var f=a(this);f.data(c)||new b(this,c,d,e)})},a.fn[c].defaults=d.defaults},b}),function(a){"function"==typeof define&&define.amd?define(["picker","jquery"],a):"object"==typeof exports?module.exports=a(require("./picker.js"),require("jquery")):a(Picker,jQuery)}(function(a,b){function c(a,b){var c=this,d=a.$node[0],e=d.value,f=a.$node.data("value"),g=f||e,h=f?b.formatSubmit:b.format,i=function(){return d.currentStyle?"rtl"==d.currentStyle.direction:"rtl"==getComputedStyle(a.$root[0]).direction};c.settings=b,c.$node=a.$node,c.queue={min:"measure create",max:"measure create",now:"now create",select:"parse create validate",highlight:"parse navigate create validate",view:"parse create validate viewset",disable:"deactivate",enable:"activate"},c.item={},c.item.clear=null,c.item.disable=(b.disable||[]).slice(0),c.item.enable=-function(a){return a[0]===!0?a.shift():-1}(c.item.disable),c.set("min",b.min).set("max",b.max).set("now"),g?c.set("select",g,{format:h}):c.set("select",null).set("highlight",c.item.now),c.key={40:7,38:-7,39:function(){return i()?-1:1},37:function(){return i()?1:-1},go:function(a){var b=c.item.highlight,d=new Date(Date.UTC(b.year,b.month,b.date+a));c.set("highlight",d,{interval:a}),this.render()}},a.on("render",function(){a.$root.find("."+b.klass.selectMonth).on("change",function(){var c=this.value;c&&(a.set("highlight",[a.get("view").year,c,a.get("highlight").date]),a.$root.find("."+b.klass.selectMonth).trigger("focus"))}),a.$root.find("."+b.klass.selectYear).on("change",function(){var c=this.value;c&&(a.set("highlight",[c,a.get("view").month,a.get("highlight").date]),a.$root.find("."+b.klass.selectYear).trigger("focus"))})},1).on("open",function(){var d="";c.disabled(c.get("now"))&&(d=":not(."+b.klass.buttonToday+")"),a.$root.find("button"+d+", select").attr("disabled",!1)},1).on("close",function(){a.$root.find("button, select").attr("disabled",!0)},1)}var d=7,e=6,f=a._;c.prototype.set=function(a,b,c){var d=this,e=d.item;return null===b?("clear"==a&&(a="select"),e[a]=b,d):(e["enable"==a?"disable":"flip"==a?"enable":a]=d.queue[a].split(" ").map(function(e){return b=d[e](a,b,c)}).pop(),"select"==a?d.set("highlight",e.select,c):"highlight"==a?d.set("view",e.highlight,c):a.match(/^(flip|min|max|disable|enable)$/)&&(e.select&&d.disabled(e.select)&&d.set("select",e.select,c),e.highlight&&d.disabled(e.highlight)&&d.set("highlight",e.highlight,c)),d)},c.prototype.get=function(a){return this.item[a]},c.prototype.create=function(a,c,d){var e,g=this;return c=void 0===c?a:c,c==-1/0||1/0==c?e=c:b.isPlainObject(c)&&f.isInteger(c.pick)?c=c.obj:b.isArray(c)?(c=new Date(Date.UTC(c[0],c[1],c[2])),c=f.isDate(c)?c:g.create().obj):c=f.isInteger(c)?g.normalize(new Date(c),d):f.isDate(c)?g.normalize(c,d):g.now(a,c,d),{year:e||c.getUTCFullYear(),month:e||c.getUTCMonth(),date:e||c.getUTCDate(),day:e||c.getUTCDay(),obj:e||c,pick:e||c.getTime()}},c.prototype.createRange=function(a,c){var d=this,e=function(a){return a===!0||b.isArray(a)||f.isDate(a)?d.create(a):a};return f.isInteger(a)||(a=e(a)),f.isInteger(c)||(c=e(c)),f.isInteger(a)&&b.isPlainObject(c)?a=[c.year,c.month,c.date+a]:f.isInteger(c)&&b.isPlainObject(a)&&(c=[a.year,a.month,a.date+c]),{from:e(a),to:e(c)}},c.prototype.withinRange=function(a,b){return a=this.createRange(a.from,a.to),b.pick>=a.from.pick&&b.pick<=a.to.pick},c.prototype.overlapRanges=function(a,b){var c=this;return a=c.createRange(a.from,a.to),b=c.createRange(b.from,b.to),c.withinRange(a,b.from)||c.withinRange(a,b.to)||c.withinRange(b,a.from)||c.withinRange(b,a.to)},c.prototype.now=function(a,b,c){return b=new Date,c&&c.rel&&b.setUTCDate(b.getUTCDate()+c.rel),this.normalize(b,c)},c.prototype.navigate=function(a,c,d){var e,f,g,h,i=b.isArray(c),j=b.isPlainObject(c),k=this.item.view;if(i||j){for(j?(f=c.year,g=c.month,h=c.date):(f=+c[0],g=+c[1],h=+c[2]),d&&d.nav&&k&&k.month!==g&&(f=k.year,g=k.month),e=new Date(Date.UTC(f,g+(d&&d.nav?d.nav:0),1)),f=e.getUTCFullYear(),g=e.getUTCMonth();new Date(Date.UTC(f,g,h)).getUTCMonth()!==g;)h-=1;c=[f,g,h]}return c},c.prototype.normalize=function(a){return a.setUTCHours(0,0,0,0),a},c.prototype.measure=function(a,b){var c=this;return b?"string"==typeof b?b=c.parse(a,b):f.isInteger(b)&&(b=c.now(a,b,{rel:b})):b="min"==a?-1/0:1/0,b},c.prototype.viewset=function(a,b){return this.create([b.year,b.month,1])},c.prototype.validate=function(a,c,d){var e,g,h,i,j=this,k=c,l=d&&d.interval?d.interval:1,m=-1===j.item.enable,n=j.item.min,o=j.item.max,p=m&&j.item.disable.filter(function(a){if(b.isArray(a)){var d=j.create(a).pick;d<c.pick?e=!0:d>c.pick&&(g=!0)}return f.isInteger(a)}).length;if((!d||!d.nav)&&(!m&&j.disabled(c)||m&&j.disabled(c)&&(p||e||g)||!m&&(c.pick<=n.pick||c.pick>=o.pick)))for(m&&!p&&(!g&&l>0||!e&&0>l)&&(l*=-1);j.disabled(c)&&(Math.abs(l)>1&&(c.month<k.month||c.month>k.month)&&(c=k,l=l>0?1:-1),c.pick<=n.pick?(h=!0,l=1,c=j.create([n.year,n.month,n.date+(c.pick===n.pick?0:-1)])):c.pick>=o.pick&&(i=!0,l=-1,c=j.create([o.year,o.month,o.date+(c.pick===o.pick?0:1)])),!h||!i);)c=j.create([c.year,c.month,c.date+l]);return c},c.prototype.disabled=function(a){var c=this,d=c.item.disable.filter(function(d){return f.isInteger(d)?a.day===(c.settings.firstDay?d:d-1)%7:b.isArray(d)||f.isDate(d)?a.pick===c.create(d).pick:b.isPlainObject(d)?c.withinRange(d,a):void 0});return d=d.length&&!d.filter(function(a){return b.isArray(a)&&"inverted"==a[3]||b.isPlainObject(a)&&a.inverted}).length,-1===c.item.enable?!d:d||a.pick<c.item.min.pick||a.pick>c.item.max.pick},c.prototype.parse=function(a,b,c){var d=this,e={};return b&&"string"==typeof b?(c&&c.format||(c=c||{},c.format=d.settings.format),d.formats.toArray(c.format).map(function(a){var c=d.formats[a],g=c?f.trigger(c,d,[b,e]):a.replace(/^!/,"").length;c&&(e[a]=b.substr(0,g)),b=b.substr(g)}),[e.yyyy||e.yy,+(e.mm||e.m)-1,e.dd||e.d]):b},c.prototype.formats=function(){function a(a,b,c){var d=a.match(/\w+/)[0];return c.mm||c.m||(c.m=b.indexOf(d)+1),d.length}function b(a){return a.match(/\w+/)[0].length}return{d:function(a,b){return a?f.digits(a):b.date},dd:function(a,b){return a?2:f.lead(b.date)},ddd:function(a,c){return a?b(a):this.settings.weekdaysShort[c.day]},dddd:function(a,c){return a?b(a):this.settings.weekdaysFull[c.day]},m:function(a,b){return a?f.digits(a):b.month+1},mm:function(a,b){return a?2:f.lead(b.month+1)},mmm:function(b,c){var d=this.settings.monthsShort;return b?a(b,d,c):d[c.month]},mmmm:function(b,c){var d=this.settings.monthsFull;return b?a(b,d,c):d[c.month]},yy:function(a,b){return a?2:(""+b.year).slice(2)},yyyy:function(a,b){return a?4:b.year},toArray:function(a){return a.split(/(d{1,4}|m{1,4}|y{4}|yy|!.)/g)},toString:function(a,b){var c=this;return c.formats.toArray(a).map(function(a){return f.trigger(c.formats[a],c,[0,b])||a.replace(/^!/,"")}).join("")}}}(),c.prototype.isDateExact=function(a,c){var d=this;return f.isInteger(a)&&f.isInteger(c)||"boolean"==typeof a&&"boolean"==typeof c?a===c:(f.isDate(a)||b.isArray(a))&&(f.isDate(c)||b.isArray(c))?d.create(a).pick===d.create(c).pick:b.isPlainObject(a)&&b.isPlainObject(c)?d.isDateExact(a.from,c.from)&&d.isDateExact(a.to,c.to):!1},c.prototype.isDateOverlap=function(a,c){var d=this,e=d.settings.firstDay?1:0;return f.isInteger(a)&&(f.isDate(c)||b.isArray(c))?(a=a%7+e,a===d.create(c).day+1):f.isInteger(c)&&(f.isDate(a)||b.isArray(a))?(c=c%7+e,c===d.create(a).day+1):b.isPlainObject(a)&&b.isPlainObject(c)?d.overlapRanges(a,c):!1},c.prototype.flipEnable=function(a){var b=this.item;b.enable=a||(-1==b.enable?1:-1)},c.prototype.deactivate=function(a,c){var d=this,e=d.item.disable.slice(0);return"flip"==c?d.flipEnable():c===!1?(d.flipEnable(1),e=[]):c===!0?(d.flipEnable(-1),e=[]):c.map(function(a){for(var c,g=0;g<e.length;g+=1)if(d.isDateExact(a,e[g])){c=!0;break}c||(f.isInteger(a)||f.isDate(a)||b.isArray(a)||b.isPlainObject(a)&&a.from&&a.to)&&e.push(a)}),e},c.prototype.activate=function(a,c){var d=this,e=d.item.disable,g=e.length;return"flip"==c?d.flipEnable():c===!0?(d.flipEnable(1),e=[]):c===!1?(d.flipEnable(-1),e=[]):c.map(function(a){var c,h,i,j;for(i=0;g>i;i+=1){if(h=e[i],d.isDateExact(h,a)){c=e[i]=null,j=!0;break}if(d.isDateOverlap(h,a)){b.isPlainObject(a)?(a.inverted=!0,c=a):b.isArray(a)?(c=a,c[3]||c.push("inverted")):f.isDate(a)&&(c=[a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate(),"inverted"]);break}}if(c)for(i=0;g>i;i+=1)if(d.isDateExact(e[i],a)){e[i]=null;break}if(j)for(i=0;g>i;i+=1)if(d.isDateOverlap(e[i],a)){e[i]=null;break}c&&e.push(c)}),e.filter(function(a){return null!=a})},c.prototype.nodes=function(a){var b=this,c=b.settings,g=b.item,h=g.now,i=g.select,j=g.highlight,k=g.view,l=g.disable,m=g.min,n=g.max,o=function(a,b){return c.firstDay&&(a.push(a.shift()),b.push(b.shift())),f.node("thead",f.node("tr",f.group({min:0,max:d-1,i:1,node:"th",item:function(d){return[a[d],c.klass.weekdays,'scope=col title="'+b[d]+'"']}})))}((c.showWeekdaysFull?c.weekdaysFull:c.weekdaysShort).slice(0),c.weekdaysFull.slice(0)),p=function(a){return f.node("div"," ",c.klass["nav"+(a?"Next":"Prev")]+(a&&k.year>=n.year&&k.month>=n.month||!a&&k.year<=m.year&&k.month<=m.month?" "+c.klass.navDisabled:""),"data-nav="+(a||-1)+" "+f.ariaAttr({role:"button",components:b.$node[0].id+"_table"})+' title="'+(a?c.labelMonthNext:c.labelMonthPrev)+'"')},q=function(){var d=c.showMonthsShort?c.monthsShort:c.monthsFull;return c.selectMonths?f.node("select",f.group({min:0,max:11,i:1,node:"option",item:function(a){return[d[a],0,"value="+a+(k.month==a?" selected":"")+(k.year==m.year&&a<m.month||k.year==n.year&&a>n.month?" disabled":"")]}}),c.klass.selectMonth,(a?"":"disabled")+" "+f.ariaAttr({components:b.$node[0].id+"_table"})+' title="'+c.labelMonthSelect+'"'):f.node("div",d[k.month],c.klass.month)},r=function(){var d=k.year,e=c.selectYears===!0?5:~~(c.selectYears/2);if(e){var g=m.year,h=n.year,i=d-e,j=d+e;if(g>i&&(j+=g-i,i=g),j>h){var l=i-g,o=j-h;i-=l>o?o:l,j=h}return f.node("select",f.group({min:i,max:j,i:1,node:"option",item:function(a){return[a,0,"value="+a+(d==a?" selected":"")]}}),c.klass.selectYear,(a?"":"disabled")+" "+f.ariaAttr({components:b.$node[0].id+"_table"})+' title="'+c.labelYearSelect+'"')}return f.node("div",d,c.klass.year)};return f.node("div",(c.selectYears?r()+q():q()+r())+p()+p(1),c.klass.header)+f.node("table",o+f.node("tbody",f.group({min:0,max:e-1,i:1,node:"tr",item:function(a){var e=c.firstDay&&0===b.create([k.year,k.month,1]).day?-7:0;return[f.group({min:d*a-k.day+e+1,max:function(){return this.min+d-1},i:1,node:"td",item:function(a){a=b.create([k.year,k.month,a+(c.firstDay?1:0)]);var d=i&&i.pick==a.pick,e=j&&j.pick==a.pick,g=l&&b.disabled(a)||a.pick<m.pick||a.pick>n.pick;return[f.node("div",a.date,function(b){return b.push(k.month==a.month?c.klass.infocus:c.klass.outfocus),h.pick==a.pick&&b.push(c.klass.now),d&&b.push(c.klass.selected),e&&b.push(c.klass.highlighted),g&&b.push(c.klass.disabled),b.join(" ")}([c.klass.day]),"data-pick="+a.pick+" "+f.ariaAttr({role:"gridcell",selected:d&&b.$node.val()===f.trigger(b.formats.toString,b,[c.format,a])?!0:null,activedescendant:e?!0:null,disabled:g?!0:null})),"",f.ariaAttr({role:"presentation"})]}})]}})),c.klass.table,'id="'+b.$node[0].id+'_table" '+f.ariaAttr({role:"grid",components:b.$node[0].id,readonly:!0}))+f.node("div",f.node("button",c.today,c.klass.buttonToday,"type=button data-pick="+h.pick+(a&&!b.disabled(h)?"":" disabled")+" "+f.ariaAttr({components:b.$node[0].id}))+f.node("button",c.clear,c.klass.buttonClear,"type=button data-clear=1"+(a?"":" disabled")+" "+f.ariaAttr({components:b.$node[0].id}))+f.node("button",c.close,c.klass.buttonClose,"type=button data-close=true "+(a?"":" disabled")+" "+f.ariaAttr({components:b.$node[0].id})),c.klass.footer)},c.defaults=function(a){return{labelMonthNext:"Next month",labelMonthPrev:"Previous month",labelMonthSelect:"Select a month",labelYearSelect:"Select a year",monthsFull:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],weekdaysFull:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],weekdaysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],today:"Today",clear:"Clear",close:"Close",format:"d mmmm, yyyy",klass:{table:a+"table",header:a+"header",navPrev:a+"nav--prev",navNext:a+"nav--next",navDisabled:a+"nav--disabled",month:a+"month",year:a+"year",selectMonth:a+"select--month",selectYear:a+"select--year",weekdays:a+"weekday",day:a+"day",disabled:a+"day--disabled",selected:a+"day--selected",highlighted:a+"day--highlighted",now:a+"day--today",infocus:a+"day--infocus",outfocus:a+"day--outfocus",footer:a+"footer",buttonClear:a+"button--clear",buttonToday:a+"button--today",buttonClose:a+"button--close"}}}(a.klasses().picker+"__"),a.extend("pickadate",c)}),function(a){function b(b){var e=b.find(".ms-DatePicker-monthComponents"),f=b.find(".ms-DatePicker-goToday"),g=(b.find(".ms-DatePicker-dayPicker"),b.find(".ms-DatePicker-monthPicker")),h=b.find(".ms-DatePicker-yearPicker"),i=b.find(".ms-DatePicker-wrap"),j=b.find(".ms-TextField-field").pickadate("picker");e.appendTo(i),f.appendTo(i),g.appendTo(i),h.appendTo(i),d(b),e.on("click",".js-prevMonth",function(a){a.preventDefault();var b=j.get("highlight").month-1;c(j,null,b,null)}),e.on("click",".js-nextMonth",function(a){a.preventDefault();var b=j.get("highlight").month+1;c(j,null,b,null)}),g.on("click",".js-prevYear",function(a){a.preventDefault();var b=j.get("highlight").year-1;c(j,b,null,null)}),g.on("click",".js-nextYear",function(a){a.preventDefault();var b=j.get("highlight").year+1;c(j,b,null,null)}),h.on("click",".js-prevDecade",function(a){a.preventDefault();var b=j.get("highlight").year-10;c(j,b,null,null)}),h.on("click",".js-nextDecade",function(a){a.preventDefault();var b=j.get("highlight").year+10;c(j,b,null,null)}),f.click(function(a){a.preventDefault();var c=new Date;j.set("select",[c.getFullYear(),c.getMonth(),c.getDate()]),b.removeClass("is-pickingMonths").removeClass("is-pickingYears")}),g.on("click",".js-changeDate",function(d){d.preventDefault();var e=a(this).attr("data-year"),f=a(this).attr("data-month"),g=a(this).attr("data-day");c(j,e,f,g),b.hasClass("is-pickingMonths")&&b.removeClass("is-pickingMonths")}),h.on("click",".js-changeDate",function(d){d.preventDefault(),console.log("about to change the year!");var e=a(this).attr("data-year"),f=a(this).attr("data-month"),g=a(this).attr("data-day");c(j,e,f,g),b.hasClass("is-pickingYears")&&b.removeClass("is-pickingYears")}),g.on("click",".js-showDayPicker",function(){b.removeClass("is-pickingMonths"),b.removeClass("is-pickingYears")}),e.on("click",".js-showMonthPicker",function(){b.toggleClass("is-pickingMonths")}),g.on("click",".js-showYearPicker",function(){b.toggleClass("is-pickingYears")})}function c(a,b,c,d){null==b&&(b=a.get("highlight").year),null==c&&(c=a.get("highlight").month),null==d&&(d=a.get("highlight").date),a.set("highlight",[b,c,d])}function d(a){var b=a.find(".ms-DatePicker-monthPicker"),c=a.find(".ms-DatePicker-yearPicker"),d=(a.find(".ms-DatePicker-wrap"),a.find(".ms-TextField-field").pickadate("picker"));b.find(".ms-DatePicker-currentYear").text(d.get("view").year),b.find(".ms-DatePicker-monthOption").removeClass("is-highlighted"),b.find('.ms-DatePicker-monthOption[data-month="'+d.get("highlight").month+'"]').addClass("is-highlighted"),c.find(".ms-DatePicker-currentDecade").remove(),c.find(".ms-DatePicker-optionGrid").remove();var e=d.get("highlight").year-11,f=e+" - "+(e+11),g='<div class="ms-DatePicker-currentDecade">'+f+"</div>";for(g+='<div class="ms-DatePicker-optionGrid">',year=e;e+12>year;year++)g+='<span class="ms-DatePicker-yearOption js-changeDate" data-year="'+year+'">'+year+"</span>";g+="</div>",c.append(g),c.find(".ms-DatePicker-yearOption").removeClass("is-highlighted"),c.find('.ms-DatePicker-yearOption[data-year="'+d.get("highlight").year+'"]').addClass("is-highlighted")}function e(b){a("html, body").animate({scrollTop:b.offset().top},367)}a.fn.DatePicker=function(){return this.each(function(){var c=a(this),f=c.find(".ms-TextField-field").pickadate({weekdaysShort:["S","M","T","W","T","F","S"],today:"",clear:"",close:"",onStart:function(){b(c)},klass:{input:"ms-DatePicker-input",active:"ms-DatePicker-input--active",picker:"ms-DatePicker-picker",opened:"ms-DatePicker-picker--opened",focused:"ms-DatePicker-picker--focused",holder:"ms-DatePicker-holder",frame:"ms-DatePicker-frame",wrap:"ms-DatePicker-wrap",box:"ms-DatePicker-dayPicker",header:"ms-DatePicker-header",month:"ms-DatePicker-month",year:"ms-DatePicker-year",table:"ms-DatePicker-table",weekdays:"ms-DatePicker-weekday",day:"ms-DatePicker-day",disabled:"ms-DatePicker-day--disabled",selected:"ms-DatePicker-day--selected",highlighted:"ms-DatePicker-day--highlighted",now:"ms-DatePicker-day--today",infocus:"ms-DatePicker-day--infocus",outfocus:"ms-DatePicker-day--outfocus"}}),g=f.pickadate("picker");g.on({render:function(){d(c)},open:function(){e(c)}})})}}(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Dropdown Plugin
 * 
 * Given .ms-Dropdown containers with generic <select> elements inside, this plugin hides the original
 * dropdown and creates a new "fake" dropdown that can more easily be styled across browsers.
 * 
 * @param  {jQuery Object}  One or more .ms-Dropdown containers, each with a dropdown (.ms-Dropdown-select)
 * @return {jQuery Object}  The same containers (allows for chaining)
 */
(function ($) {
    $.fn.Dropdown = function () {

        /** Go through each dropdown we've been given. */
        return this.each(function () {

            var $dropdownWrapper = $(this),
                $originalDropdown = $dropdownWrapper.children('.ms-Dropdown-select'),
                $originalDropdownOptions = $originalDropdown.children('option'),
                originalDropdownID = this.id,
                newDropdownTitle = '',
                newDropdownItems = '',
                newDropdownSource = '';

            /** Go through the options to fill up newDropdownTitle and newDropdownItems. */
            $originalDropdownOptions.each(function (index, option) {
        
                /** If the option is selected, it should be the new dropdown's title. */
                if (option.selected) {
                    newDropdownTitle = option.text;
                }

                /** Add this option to the list of items. */
                newDropdownItems += '<li class="ms-Dropdown-item' + ( (option.disabled) ? ' is-disabled"' : '"' ) + '>' + option.text + '</li>';
            
            });

            /** Insert the replacement dropdown. */
            newDropdownSource = '<span class="ms-Dropdown-title">' + newDropdownTitle + '</span><ul class="ms-Dropdown-items">' + newDropdownItems + '</ul>';
            $dropdownWrapper.append(newDropdownSource);

            function _openDropdown(evt) {
                if (!$dropdownWrapper.hasClass('is-disabled')) {

                    /** First, let's close any open dropdowns on this page. */
                    $dropdownWrapper.find('.is-open').removeClass('is-open');

                    /** Stop the click event from propagating, which would just close the dropdown immediately. */
                    evt.stopPropagation();

                    /** Before opening, size the items list to match the dropdown. */
                    var dropdownWidth = $(this).parents(".ms-Dropdown").width();
                    $(this).next(".ms-Dropdown-items").css('width', dropdownWidth + 'px');
                
                    /** Go ahead and open that dropdown. */
                    $dropdownWrapper.toggleClass('is-open');

                    /** Temporarily bind an event to the document that will close this dropdown when clicking anywhere. */
                    $(document).bind("click.dropdown", function(event) {
                        $dropdownWrapper.removeClass('is-open');
                        $(document).unbind('click.dropdown');
                    });
                }
            };

            /** Toggle open/closed state of the dropdown when clicking its title. */
            $dropdownWrapper.on('click', '.ms-Dropdown-title', function(event) {
                _openDropdown(event);
            });

            /** Keyboard accessibility */
            $dropdownWrapper.on('keyup', function(event) {
                var keyCode = event.keyCode || event.which;
                // Open dropdown on enter or arrow up or arrow down and focus on first option
                if (!$(this).hasClass('is-open')) {
                    if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
                       _openDropdown(event);
                       if (!$(this).find('.ms-Dropdown-item').hasClass('is-selected')) {
                        $(this).find('.ms-Dropdown-item:first').addClass('is-selected');
                       }
                    }
                }
                else if ($(this).hasClass('is-open')) {
                    // Up arrow focuses previous option
                    if (keyCode === 38) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').prev().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').prev().addClass('is-selected');
                        }
                    }
                    // Down arrow focuses next option
                    if (keyCode === 40) {
                        if ($(this).find('.ms-Dropdown-item.is-selected').next().siblings().size() > 0) {
                            $(this).find('.ms-Dropdown-item.is-selected').removeClass('is-selected').next().addClass('is-selected');
                        }
                    }
                    // Enter to select item
                    if (keyCode === 13) {
                        if (!$dropdownWrapper.hasClass('is-disabled')) {

                            // Item text
                            var selectedItemText = $(this).find('.ms-Dropdown-item.is-selected').text()

                            $(this).find('.ms-Dropdown-title').html(selectedItemText);

                            /** Update the original dropdown. */
                            $originalDropdown.find("option").each(function(key, value) {
                                if (value.text === selectedItemText) {
                                    $(this).prop('selected', true);
                                } else {
                                    $(this).prop('selected', false);
                                }
                            });
                            $originalDropdown.change();

                            $(this).removeClass('is-open');
                        }
                    }                
                }

                // Close dropdown on esc
                if (keyCode === 27) {
                    $(this).removeClass('is-open');
                }
            });

            /** Select an option from the dropdown. */
            $dropdownWrapper.on('click', '.ms-Dropdown-item', function () {
                if (!$dropdownWrapper.hasClass('is-disabled')) {

                    /** Deselect all items and select this one. */
                    $(this).siblings('.ms-Dropdown-item').removeClass('is-selected')
                    $(this).addClass('is-selected');

                    /** Update the replacement dropdown's title. */
                    $(this).parents().siblings('.ms-Dropdown-title').html($(this).text());

                    /** Update the original dropdown. */
                    var selectedItemText = $(this).text();
                    $originalDropdown.find("option").each(function(key, value) {
                        if (value.text === selectedItemText) {
                            $(this).prop('selected', true);
                        } else {
                            $(this).prop('selected', false);
                        }
                    });
                    $originalDropdown.change();
                }
            });

        });
    };
})(jQuery);
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * List Item Plugin
 *
 * Adds basic demonstration functionality to .ms-ListItem components.
 *
 * @param  {jQuery Object}  One or more .ms-ListItem components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.ListItem = function () {

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $listItem = $(this);

      /** Detect clicks on selectable list items. */
      $listItem.on('click', '.js-toggleSelection', function(event) {
        $(this).parents('.ms-ListItem').toggleClass('is-selected');
      });

    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Nav Bar Plugin
 */
(function ($) {
  $.fn.NavBar = function () {

    /** Go through each nav bar we've been given. */
    return this.each(function () {

      var $navBar = $(this);

      // Open the nav bar on mobile.
      $navBar.on('click', '.js-openMenu', function(event) {
        event.stopPropagation();
        $navBar.toggleClass('is-open');
      });

      // Close the nav bar on mobile.
      $navBar.click(function() {
        if ($navBar.hasClass('is-open')) {
          $navBar.removeClass('is-open');
        }
      });

      // Set selected states and open/close menus.
      $navBar.on('click', '.ms-NavBar-item:not(.is-disabled)', function(event) {
        event.stopPropagation();

        // Prevent default actions from firing if links are not found.
        if ($(this).children('.ms-NavBar-link').length === 0) {
          event.preventDefault();
        }

        // Deselect all of the items.
        $(this).siblings('.ms-NavBar-item').removeClass('is-selected');

        // Close and blur the search box if it doesn't have text.
        if ($navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field').val().length === 0) {
          $('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
        }

        // Does the selected item have a menu?
        if ($(this).hasClass('ms-NavBar-item--hasMenu')) {

          // Toggle 'is-open' to open or close it.
          $(this).children('.ms-ContextualMenu:first').toggleClass('is-open');

          // Toggle 'is-selected' to indicate whether it is active.
          $(this).toggleClass('is-selected');
        } else {
          // Doesn't have a menu, so just select the item.
          $(this).addClass('is-selected');

          // Close the submenu and any open contextual menus.
          $navBar.removeClass('is-open').find('.ms-ContextualMenu').removeClass('is-open');
        }

        // Is this the search box? Open it up and focus on the search field.
        if ($(this).hasClass('ms-NavBar-item--search')) {
          $(this).addClass('is-open');
          $(this).find('.ms-TextField-field').focus();

          // Close any open menus.
          $navBar.find('.ms-ContextualMenu:first').removeClass('is-open');
        }
      });

      // Prevent contextual menus from being hidden when clicking on them.
      $navBar.on('click', '.ms-NavBar-item .ms-ContextualMenu', function(event) {
        event.stopPropagation();

        // Collapse the mobile "panel" for nav items.
        $(this).removeClass('is-open');
        $navBar.removeClass('is-open').find('.ms-NavBar-item--hasMenu').removeClass('is-selected');
      });

      // Hide any menus and close the search box when clicking anywhere in the document.
      $(document).on('click', 'html', function(event) {
        $navBar.find('.ms-NavBar-item').removeClass('is-selected').find('.ms-ContextualMenu').removeClass('is-open');

        // Close and blur the search box if it doesn't have text.
        if ($navBar.find('.ms-NavBar-item.ms-NavBar-item--search .ms-TextField-field').val().length === 0) {
          $navBar.find('.ms-NavBar-item.ms-NavBar-item--search').removeClass('is-open').find('.ms-TextField-field').blur();
        }
      });
    });
  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Panel Plugin
 *
 * Adds basic demonstration functionality to .ms-Panel components.
 *
 * @param  {jQuery Object}  One or more .ms-Panel components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Panel = function () {

    /** Go through each panel we've been given. */
    return this.each(function () {

      var $panel = $(this);
      var $panelMain = $panel.find(".ms-Panel-main");

      /** Hook to open the panel. */
      $(".js-togglePanel").on("click", function() {
        // Panel must be set to display "block" in order for animations to render
        $panelMain.css({display: "block"});
        $panel.toggleClass("is-open");
      });

      $panelMain.on("animationend webkitAnimationEnd MSAnimationEnd", function(event) {
        if (event.originalEvent.animationName === "fadeOut") {
          // Hide and Prevent ms-Panel-main from being interactive
          $(this).css({display: "none"});
        }
      });

    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * People Picker Plugin
 *
 * Adds basic demonstration functionality to .ms-PeoplePicker components.
 * 
 * @param  {jQuery Object}  One or more .ms-PeoplePicker components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.PeoplePicker = function () {

    /** Iterate through each people picker provided. */
    return this.each(function () {

      var $peoplePicker = $(this);
      var $searchField = $peoplePicker.find(".ms-PeoplePicker-searchField");
      var $results = $peoplePicker.find(".ms-PeoplePicker-results");
      var $searchMore = $peoplePicker.find(".ms-PeoplePicker-searchMore");
      var $selected = $peoplePicker.find('.ms-PeoplePicker-selected');
      var $selectedPeople = $peoplePicker.find(".ms-PeoplePicker-selectedPeople")
      var $selectedCount = $peoplePicker.find(".ms-PeoplePicker-selectedCount")
      var isActive = false;
      var spinner;

      // Run when focused or clicked
      function peoplePickerActive(event) {
        /** Scroll the view so that the people picker is at the top. */
        $('html, body').animate({
          scrollTop: $peoplePicker.offset().top
        }, 367);

        /** Start by closing any open people pickers. */
        if ( $('.ms-PeoplePicker').hasClass('is-active') ) {
          $(".ms-PeoplePicker").removeClass("is-active");
        }

        isActive = true;

        /** Stop the click event from propagating, which would just close the dropdown immediately. */
        event.stopPropagation();

        /** Before opening, size the results panel to match the people picker. */
        $results.width($peoplePicker.width() - 2);

        /** Show the $results by setting the people picker to active. */
        $peoplePicker.addClass("is-active");

        /** Temporarily bind an event to the document that will close the people picker when clicking anywhere. */
        $(document).bind("click.peoplepicker", function(event) {
            $peoplePicker.removeClass('is-active');
            $(document).unbind('click.peoplepicker');
            isActive = false;
        });
      };
      
      /** Set to active when focusing on the input. */
      $peoplePicker.on('focus', '.ms-PeoplePicker-searchField', function(event) {
        peoplePickerActive(event);
      });

      /** Set to active when clicking on the input. */
      $peoplePicker.on('click', '.ms-PeoplePicker-searchField', function(event) {
        peoplePickerActive(event);
      });

      /** Keep the people picker active when clicking within it. */
      $(this).click(function (event) {
          event.stopPropagation();
      });

      /** Add the selected person to the text field or selected list and close the people picker. */
      $results.on('click', '.ms-PeoplePicker-result', function (event) {
          var selectedName = $(this).find(".ms-Persona-primaryText").html();
          var selectedTitle = $(this).find(".ms-Persona-secondaryText").html();
          var personaHTML = '<div class="ms-PeoplePicker-persona">' +
                '<div class="ms-Persona ms-Persona--xs">' +
                                   '<div class="ms-Persona-imageArea">' +
                                     '<i class="ms-Persona-placeholder ms-Icon ms-Icon--person"></i>' +
                                     '<img class="ms-Persona-image" src="../src/components/persona/Persona.Person.jpg">' +
                                     '<div class="ms-Persona-presence"></div>' +
                                   '</div>' +
                                   '<div class="ms-Persona-details">' +
                                     '<div class="ms-Persona-primaryText">' + selectedName + '</div>' +
                                  ' </div>' +
                                 '</div>' +
                                 '<button class="ms-PeoplePicker-personaRemove">' +
                                   '<i class="ms-Icon ms-Icon--x"></i>' +
                                ' </button>' +
                               '</div>';
          var personaListItem = '<li class="ms-PeoplePicker-selectedPerson">' +
                  '<div class="ms-Persona">' +
                         '<div class="ms-Persona-imageArea">' +
                           '<i class="ms-Persona-placeholder ms-Icon ms-Icon--person"></i>' +
                            '<img class="ms-Persona-image" src="../src/components/persona/Persona.Person2.png"><div class="ms-Persona-presence"></div>' +
                         '</div>' +
                         '<div class="ms-Persona-details">' +
                            '<div class="ms-Persona-primaryText">' + selectedName + '</div>' +
                            '<div class="ms-Persona-secondaryText">' + selectedTitle + '</div>' +
                          '</div>' +
                        '</div>' +
                        '<button class="ms-PeoplePicker-resultAction js-selectedRemove"><i class="ms-Icon ms-Icon--x"></i></button>' +
                    '</li>';
          if (!$peoplePicker.hasClass('ms-PeoplePicker--facePile')) {
            $searchField.before(personaHTML);
            $peoplePicker.removeClass("is-active");
            resizeSearchField($peoplePicker);
          }
          else {
            if (!$selected.hasClass('is-active')) {
              $selected.addClass('is-active');
            }
            $selectedPeople.prepend(personaListItem);
            $peoplePicker.removeClass("is-active");

            var count = $peoplePicker.find('.ms-PeoplePicker-selectedPerson').length;
            $selectedCount.html(count);
          }
      });

      /** Remove the persona when clicking the personaRemove button. */
      $peoplePicker.on('click', '.ms-PeoplePicker-personaRemove', function(event) {
        $(this).parents('.ms-PeoplePicker-persona').remove();

        /** Make the search field 100% width if all personas have been removed */
        if ( $('.ms-PeoplePicker-persona').length == 0 ) {
          $peoplePicker.find('.ms-PeoplePicker-searchField').outerWidth('100%');
        } else {
          resizeSearchField($peoplePicker);
        }
      });

      /** Trigger additional searching when clicking the search more area. */
      $results.on('click', '.js-searchMore', function(event) {
        var $searchMore = $(this);
        var primaryLabel = $searchMore.find(".ms-PeoplePicker-searchMorePrimary");
        var originalPrimaryLabelText = primaryLabel.html();

        /** Change to searching state. */
        $searchMore.addClass("is-searching");
        primaryLabel.html("Searching for &ldquo;Sen&rdquo;");

        /** Attach Spinner */
        if (!spinner) {
          spinner = new fabric.Spinner($searchMore.get(0));
        } else {
          spinner.start();
        }
        
        /** Return the original state. */
        setTimeout(function() {
            $searchMore.removeClass("is-searching");
            primaryLabel.html(originalPrimaryLabelText);
            spinner.stop();
        }, 3000);
      });

      /** Remove a result using the action icon. */
      $results.on('click', '.js-resultRemove', function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-result").remove();
      });

      /** Expand a result if more details are available. */
      $results.on('click', '.js-resultExpand', function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-result").toggleClass("is-expanded");
      });

      /** Remove a selected person using the action icon. */
      $selectedPeople.on('click', '.js-selectedRemove', function(event) {
          event.stopPropagation();
          $(this).parent(".ms-PeoplePicker-selectedPerson").remove();
          var count = $peoplePicker.find('.ms-PeoplePicker-selectedPerson').length;
          $selectedCount.html(count);
          if ($peoplePicker.find('.ms-PeoplePicker-selectedPerson').length === 0) {
            $selected.removeClass('is-active');
          }
      });

    });
  };

  function resizeSearchField($peoplePicker) {

    var $searchBox = $peoplePicker.find('.ms-PeoplePicker-searchBox');

    // Where is the right edge of the search box?
    var searchBoxLeftEdge = $searchBox.position().left;
    var searchBoxWidth = $searchBox.outerWidth();
    var searchBoxRightEdge = searchBoxLeftEdge + searchBoxWidth;

    // Where is the right edge of the last persona component?
    var $lastPersona = $searchBox.find('.ms-PeoplePicker-persona:last');
    var lastPersonaLeftEdge = $lastPersona.offset().left;
    var lastPersonaWidth = $lastPersona.outerWidth();
    var lastPersonaRightEdge = lastPersonaLeftEdge + lastPersonaWidth;

    // Adjust the width of the field to fit the remaining space.
    var newFieldWidth = searchBoxRightEdge - lastPersonaRightEdge - 7;

    // Don't let the field get too tiny.
    if (newFieldWidth < 100) {
      newFieldWidth = "100%";
    }

    $peoplePicker.find('.ms-PeoplePicker-searchField').outerWidth(newFieldWidth);
  }

})(jQuery);
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Persona Card Plugin
 *
 * Adds basic demonstration functionality to .ms-PersonaCard components.
 *
 * @param  {jQuery Object}  One or more .ms-PersonaCard components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.PersonaCard = function () {

    /** Go through each file picker we've been given. */
    return this.each(function () {

      var $personaCard = $(this);

      /** When selecting an action, show its details. */
      $personaCard.on('click', '.ms-PersonaCard-action', function() {

        /** Select the correct tab. */
        $personaCard.find('.ms-PersonaCard-action').removeClass('is-active');
        $(this).addClass('is-active');

        /** Function for switching selected item into view by adding a class to ul. */
        var updateForItem = function(item){
          var wrapper = document.getElementById("detailList");
          var previousItem = wrapper.className + "";
          var detail = item.charAt(0).toUpperCase() + item.slice(1);
          var nextItem = "ms-PersonaCard-detail"+detail;
          if (previousItem != nextItem){
            wrapper.classList.remove(previousItem);
            wrapper.classList.add(nextItem);
          }
        }

        /** Get id of selected item */
        var el = $(this).attr('id');
        /** Add detail class to ul to switch it into view. */
        updateForItem(el);

        /** Display the corresponding details. */
        var requestedAction = $(this).attr('id');
        $personaCard.find('.ms-PersonaCard-actionDetails').removeClass('is-active');
        $personaCard.find('#' + requestedAction + '.ms-PersonaCard-actionDetails').addClass('is-active');

      });

      /** Toggle more details. */
      $personaCard.on('click', '.ms-PersonaCard-detailExpander', function() {
        $(this).parent('.ms-PersonaCard-actionDetails').toggleClass('is-collapsed');
      });

    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Pivot Plugin
 *
 * Adds basic demonstration functionality to .ms-Pivot components.
 *
 * @param  {jQuery Object}  One or more .ms-Pivot components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.Pivot = function () {

    /** Go through each pivot we've been given. */
    return this.each(function () {

      var $pivotContainer = $(this);

      /** When clicking/tapping a link, select it. */
      $pivotContainer.on('click', '.ms-Pivot-link', function(event) {
        event.preventDefault();
        $(this).siblings('.ms-Pivot-link').removeClass('is-selected');
        $(this).addClass('is-selected');
      });

    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * SearchBox Plugin
 *
 * Adds basic demonstration functionality to .ms-SearchBox components.
 *
 * @param  {jQuery Object}  One or more .ms-SearchBox components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.SearchBox = function () {

    /** Iterate through each text field provided. */
    return this.each(function () {
      // Set cancel to false
      var cancel = false;

      /** SearchBox focus - hide label and show cancel button */
      $(this).find('.ms-SearchBox-field').on('focus', function() {
        /** Hide the label on focus. */
        $(this).siblings('.ms-SearchBox-label').hide();
        // Show cancel button by adding is-active class
        $(this).parent('.ms-SearchBox').addClass('is-active');
      });


      // If cancel button is selected, change cancel value to true
      $(this).find('.ms-SearchBox-closeButton').on('mousedown', function() {
        cancel = true;
      });

      /** Show the label again when leaving the field. */
      $(this).find('.ms-SearchBox-field').on('blur', function() {

        // If cancel button is selected remove the text and show the label
        if ( cancel == true ) {
          $(this).val('');
          $(this).siblings('.ms-SearchBox-label').show();
        }

        // Remove is-active class - hides cancel button
        $(this).parent('.ms-SearchBox').removeClass('is-active');

        /** Only do this if no text was entered. */
        if ($(this).val().length === 0 ) {
          $(this).siblings('.ms-SearchBox-label').show();
        }

        // Reset cancel to false
        cancel = false;
      });


    });

  };
})(jQuery);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Spinner Component
 *
 * An animating activity indicator.
 *
 */

/**
 * @namespace fabric
 */
var fabric = fabric || {};

/**
 * @param {DOMElement} holderElement - The element the Spinner will attach itself to.
 * @param {string} type - The type of spinner. Set this property to "sixteen" for sixteen dot version. The default is eight.
 */

fabric.Spinner = function(holderElement, spinnerType) {

    var _holderElement = holderElement;
    var _spinnerType = spinnerType || "eight";
    var eightSize = 0.18;
    var sixteenSize = 0.1;
    var circleObjects = [];
    var animationSpeed = 80;
    var interval;
    var spinner;
    var numCircles;
    var offsetSize;

    /**
     * @function start - starts or restarts the animation sequence
     * @memberOf fabric.Spinner
     */
    function start() {
        interval = setInterval(function() {
            var i = circleObjects.length;
            while(i--) {
                _fade(circleObjects[i]);
            }
        }, animationSpeed);
    }

    /**
     * @function stop - stops the animation sequence
     * @memberOf fabric.Spinner
     */
    function stop() {
        clearInterval(interval);
    }

    //private methods

    function _init() {
        if(_spinnerType === "sixteen") {
            offsetSize = sixteenSize;
            numCircles = 16;
        } else {
            offsetSize = eightSize;
            numCircles = 8;
        }
        _createCirclesAndArrange();
        _initializeOpacities();
        start();
    }

    function _initializeOpacities() {
        var i = numCircles, j;
        while(i--) {
            j = circleObjects.length;
            while(j--) {
                _fade(circleObjects[j]);
            }
        }
    }

    function _fade(circleObject) {
        var opacity;
        if(circleObject.j < numCircles) {
            if(Math.floor(circleObject.j / (numCircles / 2))) {
                opacity = _getOpacity(circleObject.element) - 2 / numCircles;
            } else{
                opacity = _getOpacity(circleObject.element) + 2 / numCircles;
            }
        } else {
            circleObject.j = 0;
            opacity = 2/ numCircles;
        }
        _setOpacity(circleObject.element, opacity);
        circleObject.j++;
    }

    function _getOpacity(element) {
        return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
    }

    function _setOpacity(element, opacity) {
        element.style.opacity = opacity;
    }

    function _createCircle() {
        var circle = document.createElement('div');
        var parentWidth = parseInt(window.getComputedStyle(spinner).getPropertyValue("width"), 10);
        circle.className = "ms-Spinner-circle";
        circle.style.width = circle.style.height = parentWidth * offsetSize + "px";
        return circle;
    }

    function _createCirclesAndArrange() {
        spinner = document.createElement("div");
        spinner.className = "ms-Spinner";
        _holderElement.appendChild(spinner);
        var width = spinner.clientWidth;
        var height = spinner.clientHeight;
        var angle = 0;
        var offset = width * offsetSize;
        var step = (2 * Math.PI) / numCircles;
        var i = numCircles;
        var circleObject;
        var radius = (width- offset) * 0.5;
        while(i--) {
            var circle = _createCircle();
            var x = Math.round(width * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
            var y = Math.round(height * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
            spinner.appendChild(circle);
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            angle += step;
            circleObject = {element:circle, j:i};
            circleObjects.push(circleObject);
        }
    }

    _init();

    return {
        start:start,
        stop:stop
    };
};
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.

/**
 * Text Field Plugin
 *
 * Adds basic demonstration functionality to .ms-TextField components.
 *
 * @param  {jQuery Object}  One or more .ms-TextField components
 * @return {jQuery Object}  The same components (allows for chaining)
 */
(function ($) {
  $.fn.TextField = function () {

    /** Iterate through each text field provided. */
    return this.each(function () {

      /** Does it have a placeholder? */
      if ($(this).hasClass("ms-TextField--placeholder")) {

        /** Hide the label on click. */
        $(this).on('click', function () {
          $(this).find('.ms-Label').hide();
        });

        /** Show the label again when leaving the field. */
        $(this).find('.ms-TextField-field').on('blur', function () {

          /** Only do this if no text was entered. */
          if ($(this).val().length === 0) {
            $(this).siblings('.ms-Label').show();
          }
        });
      };

      /** Underlined - adding/removing a focus class */
      if ($(this).hasClass('ms-TextField--underlined')) {

        /** Add is-active class - changes border color to theme primary */
        $(this).find('.ms-TextField-field').on('focus', function() {
          $(this).parent('.ms-TextField--underlined').addClass('is-active');
        });

        /** Remove is-active on blur of textfield */
        $(this).find('.ms-TextField-field').on('blur', function() {
          $(this).parent('.ms-TextField--underlined').removeClass('is-active');
        });
      };

    });
  };
})(jQuery);
