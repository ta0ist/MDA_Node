	(function(window) {
	    function ConboBox(obj) {
	        this.width = obj.width || 300;
	        this.id = obj.id;
	        this.data = obj.data || [];
	        this.fieldName = obj.fieldName || 'name';
	        this.fieldId = obj.fieldId || 'id';
	        this.selected = undefined;
	        this.callBack = obj.callBack || false;
	    }
	    ConboBox.prototype.init = function() {
	        var me = this
	        var box = document.querySelector(this.id);
	        box.style.width = me.width + 'px';
	        var div = document.createElement('div');
	        var selectCentent = (function() {
	            var html = "<ul class='nav nav-pills nav-stacked select-content hidden' style='border: 1px solid #ccc;background:#fff;height:300px;overflow:auto;position:absolute;top:40px;left:0;'>"
	            me.data.forEach(function(v, i) {
	                html += '<li><a href="javascript:;" data-type="' + v[me.fieldId] + '">' + v[me.fieldName] + '</a></li>';
	            })
	            html += '</ul>';
	            return html;
	        })();

	        div.innerHTML = '<input type="text" class="form-control text-center" readonly style="background:#696969;border:0;font-size:1.1em;color:#fff;height:40px;"/>' + selectCentent;
	        box.appendChild(div);
	        var input = document.querySelectorAll(this.id + ' input')[0];
	        var ul = document.querySelectorAll(this.id + ' ul')[0];
	        ul.style.width = this.width;
	        input.value = this.data[0].MAC_NAME;
	        me.events();
	        return me;

	    }
	    ConboBox.prototype.events = function(box) {
	        var me = this;
	        var a = document.querySelectorAll(this.id + ' a');
	        var input = document.querySelectorAll(this.id + ' input')[0];
	        var ul = document.querySelectorAll(this.id + ' ul')[0];
	        input.onclick = function(e) {
	                var e = e || window.event;
	                e.stopPropagation();
	                ul.className = "nav nav-pills nav-stacked select-content show";
	            }
	            // document.onclick=function(){
	            // 	ul.className="nav nav-pills nav-stacked select-content hidden";
	            // }
	        document.addEventListener('click', function() {
	            ul.className = "nav nav-pills nav-stacked select-content hidden";
	        });
	        a.forEach(function(v, i) {
	            v.onclick = function() {
	                input.value = this.innerHTML;
	                me.selected = this.getAttribute('data-type');
	                me.callBack && me.callBack();


	            }
	        })
	    }

	    ConboBox.prototype.getSelected = function() {
	        return this.selected;
	    }

	    ConboBox.prototype.rowData = function() {
	        var me = this;
	        var obj = undefined;
	        me.data.forEach(function(v, i) {
	            if (v[me.fieldId] == me.selected) {
	                obj = v;
	            }
	        })
	        return obj;
	    }

	    window.ConboBox = ConboBox;
	})(window)