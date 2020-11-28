$(() => {
    $('[data-toggle="tooltip"]').tooltip();

    //$('input[data-role="blueprint-tags"]').selectize({
    //    plugins: ['remove_button', 'restore_on_backspace'],
    //    allowEmptyOption: false,
    //    delimiter: ' ',
    //    options: [],
    //    create: function (x) {
    //        return { value: x, text: x }
    //    },
    //    onInitialize: function() {
    //        const options = this.$input.data('options');
    //        if (options) {
    //            const that = this;
    //            options.split(',').forEach(function (x) {
    //                that.addOption({ value: x, text: x });
    //            });

    //            this.blur();
    //        }
    //    }
    //});

    $('select[data-role="blueprint-tags"]').selectize({
        plugins: ['remove_button'],
        persist: false,
        closeAfterSelect: true
    });

    $('#import-modal-new').on('shown.bs.modal', () => {
        $('#import-modal-new textarea').trigger('focus');
    });

    $('#import-modal-version').on('shown.bs.modal', () => {
        $('#import-modal-version textarea').trigger('focus');
    });

    $('#blueprint-filters input, #blueprint-filters select').on('change', () => {
        const sortField = $('#blueprint-filters-sort-field').val();
        const sortDir = $('#blueprint-filters-sort-dir').val();
        const tags = $('#blueprint-filters-tags-input').val();

        $('#blueprint-filters-tags').val(tags.join(','));
        $('#blueprint-filters-sort').val([sortField, sortDir].join(','));
        $('#blueprint-filters').submit();
    });
});
