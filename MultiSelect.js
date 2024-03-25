class MultiSelect {

    constructor(select_element, preferences = {}, callback_fn = null) {
        this.css_prefix = 'multi-selector-';
        this.$select = $(select_element);
        this.callback_fn = callback_fn;
        this.preferences = {
            use_styled_checkboxes: true,
            ignore_first_option: true,
            checkbox_css_class: this.css_prefix + 'input',
            label_class: this.css_prefix + 'label',
            n_selected_singular: 'item',
            n_selected_plural: '',
        };
        $.extend(this.preferences, preferences);
        this.$element = this.create_checkbox_container();
        this.init();
    }

    init()
    {
        this.$select.hide();
        this.populate_checkbox_list();
        this.add_event_listeners();
    }

    create_checkbox_container()
    {
        const container_class = `${this.css_prefix}container`;
        const container = $('<div/>').addClass(container_class);
        container.attr(this.$select.data());

        const count = $('<span/>').text('0 items selected').addClass(`${this.css_prefix}list-count`),
            toggle = $('<span/>').html('<i class="fas fa-chevron-down"></i>').addClass(`${this.css_prefix}list-toggle`),
            list_ctn = $('<div/>').addClass(`${this.css_prefix}list-ctn`);

        const pseudo_select = $('<span/>').addClass(`${this.css_prefix}pseudo-select`);

        // If select element is empty
        if (this.$select.find('option').length === 0)
        {
            pseudo_select.html(`<span class="${this.css_prefix}no-options">No options</span>`);
            container.append(pseudo_select);
            this.$select.after(container);
            return container;
        }

        pseudo_select.append(count, toggle);

        container.append(pseudo_select, list_ctn);
        if(this.$select.next('.' + container_class).length > 0)
            this.$select.next('.' + container_class).remove();
        this.$select.after(container);

        return container;
    }

    _generate_checkbox_list()
    {
        const list_ctn = this.$element.find(`.${this.css_prefix}list-ctn`);
        list_ctn.empty();

        const select_options = this.$select.find('option');
        select_options.each((index, option) =>
        {
            if(this.preferences.ignore_first_option && index === 0)
                return true;

            const $option = $(option),
                label = $('<label/>').addClass(this.preferences.label_class),
                label_text = $('<span/>').addClass(`${this.css_prefix}label-text`).text($option.text());

            const checkbox_input = $('<input/>').attr({
                type: 'checkbox',
                value: $option.val(),
                disabled: $option.prop('disabled'),
                checked: $option.prop('selected'),
            }).data($option.data());

            if(this.preferences.use_styled_checkboxes)
            {
                const checkbox_ctn = $('<div/>').addClass(`${this.css_prefix}custom-checkbox-container`),
                    custom_checkbox = $('<span/>').addClass(`${this.css_prefix}custom-checkbox`);

                if(this.preferences.checkbox_css_class)
                    custom_checkbox.addClass(this.preferences.checkbox_css_class);
                if(checkbox_input.prop('checked'))
                    custom_checkbox.addClass('checked');

                checkbox_input.on('change', () => {
                    custom_checkbox.toggleClass('checked', checkbox_input.prop('checked'));
                    this.update_selected_count();
                });

                checkbox_ctn.append(custom_checkbox);
                label.append(checkbox_ctn, checkbox_input, label_text);
            }
            else
            {
                checkbox_input.addClass('.not-fancy');
                if(this.preferences.checkbox_css_class)
                    checkbox_input.addClass(this.preferences.checkbox_css_class);
                label.append(checkbox_input, label_text);
            }

            list_ctn.append(label);
        });
    }

    prepend_toggle_all_checkbox()
    {
        const toggleAllSpan = $('<span/>').addClass('toggle-all-checkbox').text('Toggle All');
        toggleAllSpan.on('click', () =>
        {
            const isChecked = toggleAllSpan.attr('data-checked') === 'true';
            const inps = this.$element.find(`.${this.css_prefix}list-ctn input`);
            inps.prop('checked', !isChecked).trigger('change');

            toggleAllSpan.attr('data-checked', !isChecked);
        });

        this.$element.find(`.${this.css_prefix}list-ctn`).prepend(toggleAllSpan);
    }

    populate_checkbox_list()
    {
        this._generate_checkbox_list();
        this.prepend_toggle_all_checkbox();
        this.update_selected_count();
    }

    refresh_options()
    {
        this._generate_checkbox_list();
        this.update_selected_count();
    }

    check_options(values, clear_currently_checked = true)
    {
        if(clear_currently_checked)
        {
            this.$element.find(`.${this.css_prefix}list-ctn input:checked`).prop('checked', false);
            this.$element.find(`.${this.css_prefix}custom-checkbox.checked`).removeClass('checked');
        }

        const checkboxes = this.$element.find(`.${this.css_prefix}list-ctn input`);
        values.forEach(value =>
        {
            let checkbox = checkboxes.filter(`[value="${value}"]`);
            checkbox.prop('checked', true);
            checkbox.parent().find(`.${this.css_prefix}custom-checkbox`).addClass('checked');
        });

        this.update_selected_count();
    }

    get_checked_option_values()
    {
        return this.$element.find(`.${this.css_prefix}list-ctn input:checked`).map(function () {
            return $(this).val();
        }).get();
    }

    update_selected_count()
    {
        const count_ctn = this.$element.find(`.${this.css_prefix}list-count`),
            n = this.$element.find('input:checked').length,
            txt = (n === 1)
                ? this.preferences.n_selected_singular
                : (this.preferences.n_selected_plural || `${this.preferences.n_selected_singular}s`);

        count_ctn.html(`${n} <span class="${this.css_prefix}list-count-descriptor">${txt}</span> selected`);
    }

    toggle_checkbox_list()
    {
        const listCtn = this.$element.find(`.${this.css_prefix}list-ctn`),
            pseudo_select = Math.ceil(this.$element.find(`.${this.css_prefix}pseudo-select`).width()),
            closing = (listCtn.is(':visible')),
            svg = this.$element.find('.multi-selector-list-toggle > svg'),
            ico = (closing) ? 'chevron-down' : 'chevron-up';

        listCtn.css('min-width', 'calc(' + pseudo_select + 'px + 1.75em)');
        listCtn.stop().animate({
            height: 'toggle'
        }, 150, 'swing', function()
        {

            svg.toggleClass('fa-chevron-down', closing).toggleClass('fa-chevron-up', !closing).attr('data-icon', ico);
        });
    }

    close_checkbox_list()
    {
        const listCtn = this.$element.find(`.${this.css_prefix}list-ctn`);
        listCtn.hide();
    }

    add_event_listeners()
    {
        const _this = this;
        this.$element.find(`.${this.css_prefix}list-ctn input`).on('change', function()
        {
            _this.update_selected_count();
            if(_this.callback_fn)
                _this.callback_fn($(this).val(), $(this).prop('checked'));
        });
        this.$element.find(`.${this.css_prefix}pseudo-select`).on('click', () =>
        {
            this.toggle_checkbox_list();
        });
    }
}
