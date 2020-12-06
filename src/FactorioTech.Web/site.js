$(() => {
    $('[data-toggle="tooltip"]').tooltip();

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

    $('[data-toggle="copy-blueprint"').on('click', e => {
        var $input = $('<input>').css({
          position: 'absolute',
          left:     '-1000px',
          top:      '-1000px'
        });

        $input.val($(e.target).attr('data-payload'));
        $('body').append($input);

        $input.select();

        document.execCommand('copy');

        $input.remove();

        $(e.target).tooltip({
            trigger: 'manual',
            title: '✔️ Copied!',
            delay: { hide: 1500 }
        }).tooltip('show');

        setTimeout(() => $(e.target).tooltip('hide'), 3000);
    });
});
