Ext.ns('Ext.ux.form');
Ext.ux.form.TimePickerField = function(config) {
	Ext.ux.form.TimePickerField.superclass.constructor.call(this, config);

};
Ext.extend(Ext.ux.form.TimePickerField, Ext.form.Field, {
			actionMode: 'wrap',
			cls : 'x-form-timepickerfield',
			hoursSpinner : null,
			minutesSpinner : null,
			secondsSpinner : null,
			spinnerCfg : {
				width : 40
			},
			spinnerFixBoundries : function(value) {
				if (value < this.field.minValue) {
					value = this.field.maxValue;
				}
				if (value > this.field.maxValue) {
					value = this.field.minValue;
				}
				return this.fixPrecision(value);
			},	
			onRender : function(ct, position) {
				this.rendered = false;
				this.date = new Date();
				var values = {};
				if (this.value) {
					values = this._valueSplit(this.value);
					this.date.setHours(values.h);
					this.date.setMinutes(values.m);
					this.date.setSeconds(values.s);
					delete this.value;
				} else {
					values = {
						h : this.date.getHours(),
						m : this.date.getMinutes(),
						s : this.date.getSeconds()
					};
				}; 
				var spinnerWrap = Ext.DomHelper.insertBefore(ct, {
							tag : 'div',
							style: 'padding-left:5;border:0;'
						});
				var cfg = Ext.apply({}, this.spinnerCfg, {
							renderTo : spinnerWrap,
							readOnly : this.readOnly,
							disabled : this.disabled,
							listeners : {
								spin : {
									fn : this.onSpinnerChange,
									scope : this
								},
								valid : {
									fn : this.onSpinnerChange,
									scope : this
								},
								afterrender : {
									fn : function(spinner) {
										spinner.wrap.applyStyles('float: left');
									},
									single : true
								}
							}
						});
				this.hoursSpinner = new Ext.ux.form.SpinnerField(Ext.apply({},
						cfg, {
							minValue : 0,
							maxValue : 23,
							cls : 'first',
							value : values.h
						}));
				this.minutesSpinner = new Ext.ux.form.SpinnerField(Ext.apply(
						{}, cfg, {
							minValue : 0,
							maxValue : 59,
							value : values.m
						}));
				this.secondsSpinner = new Ext.ux.form.SpinnerField(Ext.apply(
						{}, cfg, {
							minValue : 0,
							maxValue : 59,
							value : values.s
						}));				
				Ext.DomHelper.append(spinnerWrap, {
							tag : 'div',
							cls : 'x-form-clear-left'
						});				
				this.el = Ext.get(spinnerWrap);
				this.wrap = Ext.get(spinnerWrap);
				this.rendered = true;
				this.secondsSpinner.setVisible(false);
			},
			_valueSplit : function(v) {
				var split = v.split(':');
				return {
					h : split.length > 0 ? split[0] : 0,
					m : split.length > 1 ? split[1] : 0,
					s : split.length > 2 ? split[2] : 0
				};
			},
			onSpinnerChange : function() {
				if (!this.rendered) {
					return;
				}
				this.fireEvent('change', this, this.getRawValue());
			},
			disable : function() {
				Ext.ux.form.TimePickerField.superclass.disable.call(this);
				this.hoursSpinner.disable();
				this.minutesSpinner.disable();
				this.secondsSpinner.disable();
			},
			enable : function() {
				Ext.ux.form.TimePickerField.superclass.enable.call(this);
				this.hoursSpinner.enable();
				this.minutesSpinner.enable();
				this.secondsSpinner.enable();
			},
			setReadOnly : function(r) {
				Ext.ux.form.TimePickerField.superclass.setReadOnly
						.call(this, r);
				this.hoursSpinner.setReadOnly(r);
				this.minutesSpinner.setReadOnly(r);
				this.secondsSpinner.setReadOnly(r);
			},
			clearInvalid : function() {
				Ext.ux.form.TimePickerField.superclass.clearInvalid.call(this);
				this.hoursSpinner.clearInvalid();
				this.minutesSpinner.clearInvalid();
				this.secondsSpinner.clearInvalid();
			},
			getRawValue : function() {
				if (!this.hoursSpinner) {
					this.date = new Date();
					return {
						h : this.date.getHours(),
						m : this.date.getMinutes(),
						s : this.date.getSeconds()
					};
				} else {
					return {
						h : this.hoursSpinner.getValue(),
						m : this.minutesSpinner.getValue(),
						s : this.secondsSpinner.getValue()
					};
				}
			},
			setRawValue : function(v) {
				this.hoursSpinner.setValue(v.h);
				this.minutesSpinner.setValue(v.m);
				this.secondsSpinner.setValue(v.s);
			},
			isValid : function(preventMark) {
				return this.hoursSpinner.isValid(preventMark)
						&& this.minutesSpinner.isValid(preventMark)
						&& this.secondsSpinner.isValid(preventMark);
			},
			validate : function() {
				return this.hoursSpinner.validate()
						&& this.minutesSpinner.validate()
						&& this.secondsSpinner.validate();
			},
			getValue : function() {
				var v = this.getRawValue();
				return String.leftPad(v.h, 2, '0') + ':'
						+ String.leftPad(v.m, 2, '0') + ':'
						+ String.leftPad(v.s, 2, '0');
			},
			setValue : function(value) {
				if (!this.rendered) {
					this.value = value;
					return;
				}
				value = this._valueSplit(value);
				this.setRawValue(value);
				this.validate();
			}
		});
Ext.form.TimePickerField = Ext.ux.form.TimePickerField;
Ext.reg('timepickerfield', Ext.form.TimePickerField);