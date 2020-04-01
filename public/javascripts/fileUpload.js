const rootStyle =window.getComputedStyle
(documen.documentElement)

if (rootStyles.getPropertyValue('--book-cover-width-large') !=null && rootStyles.getPropertyValue('--book-cover-width-large') !='') {
    ready();
} else{
    document.getElementById('main-css').addEventListener('load', ready);
}

function ready() {
    const coverWidth = parseFloat( rootStyle.getPropertyValue('--book-cover-width-large'));
    const coverAspectRatio = parseFloat(rootStyle.getPropertyValue('--book-cover-aspect-ration'));
    const coverHeight=  parseFloat(coverWidth/coverAspectRation);

    FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageResize,
        FilePondPluginFileEncode,
    )
    
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })
    
    FilePond.parse(document.body);
}

