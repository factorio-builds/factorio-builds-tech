$(() => {
    // MARKDOWN EDITOR

    const editor = ace.edit('blueprint-description-ace', {
        theme: 'ace/theme/twilight',
        mode: 'ace/mode/markdown',
        selectionStyle: 'text',
        fontSize: 16,
        minLines: 10,
        maxLines: 20,
        wrap: true
    });

    editor.session.on('change', () => {
        $('#blueprint-description').val(editor.getSession().getValue());
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', e => {
        const tab = $(e.target).attr('aria-controls');
        if (tab === 'blueprint-description-preview-content') {
            $('#blueprint-description-preview-content').load('/import?handler=preview', {
                "content": $('#blueprint-description').val(),
                "__RequestVerificationToken": $('input[name="__RequestVerificationToken"').val()
            });
        }
    });

    // BLUEPRINT IMAGE CROPPER

    const selectedImg = document.getElementById('blueprint-image-selected');
    const cropperImg = document.getElementById('blueprint-image-cropper');
    const $input = $('#blueprint-image-input');
    const $modal = $('#blueprint-image-cropper-modal');

    const showCropper = url => {
        cropperImg.src = url;
        $modal.modal('show');
    };

    const crop = (url, aspectRatio) => {
        return new Promise(resolve => {
            const inputImage = new Image();

            inputImage.onload = () => {
                const inputWidth = inputImage.naturalWidth;
                const inputHeight = inputImage.naturalHeight;
                const inputImageAspectRatio = inputWidth / inputHeight;

                let outputWidth = inputWidth;
                let outputHeight = inputHeight;
                if (inputImageAspectRatio > aspectRatio) {
                    outputWidth = inputHeight * aspectRatio;
                } else if (inputImageAspectRatio < aspectRatio) {
                    outputHeight = inputWidth / aspectRatio;
                }

                //const outputX = (outputWidth - inputWidth) * .5;
                //const outputY = (outputHeight - inputHeight) * .5;
                const outputX = 0;
                const outputY = 0;

                const outputImage = document.createElement('canvas');
                outputImage.width = outputWidth;
                outputImage.height = outputHeight;

                const ctx = outputImage.getContext('2d');
                ctx.drawImage(inputImage, outputX, outputY);
                resolve(outputImage);
            };

            inputImage.src = url;
        });
    }

    let cropper;

    $input.on('change', e => {
        var files = e.target.files;
        if (files && files.length > 0) {
            $('#blueprint-image-hash').val(null);

            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
                showCropper(reader.result);
            };
            reader.readAsDataURL(file);
        }
    });

    $modal.on('shown.bs.modal', () => {
        cropper = new Cropper(cropperImg, {
            viewMode: 1,
            dragMode: 'move',
            aspectRatio: 1,
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: false,
            highlight: false,
            cropBoxMovable: false,
            cropBoxResizable: false,
            toggleDragModeOnDblclick: false,
        });
    }).on('hidden.bs.modal', () => {
        cropper.destroy();
        cropper = null;
    });

    $('#blueprint-image-cropper-submit').on('click', () => {
        $modal.modal('hide');

        if (cropper) {
            const data = cropper.getData();

            $('#blueprint-image-x').val(Math.round(data.x));
            $('#blueprint-image-y').val(Math.round(data.y));
            $('#blueprint-image-w').val(Math.round(data.width));
            $('#blueprint-image-h').val(Math.round(data.height));

            selectedImg.src = cropper.getCroppedCanvas().toDataURL();
        }
    });

    $('.card-body .img-thumbnail')
        .css('cursor', 'pointer')
        .tooltip({
            title: 'Use this rendering as blueprint image…'
        })
        .on('click', e => {
            $input.val(null);
            $('#blueprint-image-hash').val($(e.target).attr('data-hash'));
            showCropper(e.target.src);
        });

    // initialise new blueprint without image
    if (selectedImg != null && !selectedImg.src) {
        crop($('.card-body .img-thumbnail').first().attr('src'), 1).then(canvas => {
            $('#blueprint-image-x').val(0);
            $('#blueprint-image-y').val(0);
            $('#blueprint-image-w').val(Math.round(canvas.width));
            $('#blueprint-image-h').val(Math.round(canvas.height));
            selectedImg.src = canvas.toDataURL();
        });
    }
});
