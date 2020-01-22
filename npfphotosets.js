/* npfPhotosets() v2.2.2 made by codematurgy@tumblr */
            
var rowFunctionAttached = false;

function npfPhotosets(selector, options) {
    if (typeof selector === "string") { var postCollection = document.querySelectorAll(selector); } else { var postCollection = selector; }
    if (!options.hasOwnProperty('includeCommonPhotosets')) { options.includeCommonPhotosets = false; }
    if (!options.hasOwnProperty('useTumblrLightbox')) { options.useTumblrLightbox = false; }
    if (options.photosetMargins == "" || !isNaN(options.photosetMargins)) {
        /* general margin options */
        if (options.photosetMargins == "") {
            var defaultMargin = true;
            var usedUnit = "%";
            var usedMargin = 1.4;
        } else {
            var defaultMargin = false;
            var usedUnit = "px";
            var usedMargin = options.photosetMargins;
        }
    
        /* functions used */
        function hasClass(element, desiredClass) {
            return (new RegExp("^" + desiredClass + " ").test(element.className) || new RegExp(" " + desiredClass + "$").test(element.className) || new RegExp(" " + desiredClass + " ").test(element.className) || new RegExp("^" + desiredClass + "$").test(element.className));
        }
        
        /* format existing photosets */
        if (options.includeCommonPhotosets === true) {
            unformattedPhotosets = [];
            for (i = 0; i < postCollection.length; i++) {
                var list = postCollection[i].querySelectorAll("." + options.generatedPhotosetContainerClass);
                for (j = 0; j < list.length; j++) { unformattedPhotosets.push(list[j]); }
            }
            
            for (i = 0; i < unformattedPhotosets.length; i++) {
                var photosetLayout = unformattedPhotosets[i].getAttribute("data-layout");
                var unformattedImageContainers = unformattedPhotosets[i].querySelectorAll("." + options.imageContainerClass);
                for (j = 0; j < unformattedImageContainers.length; j++) {
                    var currentPhotosetRow = parseInt(photosetLayout.slice(0, 1));
                    if (currentPhotosetRow !== "1") {
                        var row = document.createElement("div"); row.className = options.rowClass; unformattedPhotosets[i].insertBefore(row, unformattedImageContainers[j]);
                        for (k = j; k < j + currentPhotosetRow; k++) { row.appendChild(unformattedImageContainers[k]); }
                    }
                    j = j + (currentPhotosetRow - 1);
                    photosetLayout = photosetLayout.slice(1);
                }
            }
        }
    
        /* selecting possible photoset elements */
        for (i = 0; i < postCollection.length; i++) {
            rowsAndImages = [];
            var list = postCollection[i].querySelectorAll("." + options.rowClass + ", ." + options.imageContainerClass);
            for (j = 0; j < list.length; j++) { if (!hasClass(list[j].parentNode, options.generatedPhotosetContainerClass) && (hasClass(list[j], options.rowClass) || (hasClass(list[j], options.imageContainerClass) && list[j].getElementsByTagName("img").length > 0 && !hasClass(list[j].parentNode, options.rowClass)))) { rowsAndImages.push(list[j]); } }
        
            photosetGroups = [];
            if (rowsAndImages.length) {
                /* separating elements into respective photoset arrays */
                photosetGroups.push(new Array()); j = 0;
                for (k = 0; j < rowsAndImages.length; ) {
                    for (; j < rowsAndImages.length; j++) {
                        photosetGroups[k].push(rowsAndImages[j]);
                        if ((rowsAndImages[j].nextSibling === null || rowsAndImages[j].nextSibling !== rowsAndImages[j + 1]) && rowsAndImages[j + 1] !== undefined) { k++; photosetGroups.push(new Array()); }
                    }
                }
        
                /* generate photosets */
                for (j = 0; j < photosetGroups.length; j++) {
                    var photosetElement = photosetGroups[j];
                    if (photosetElement.length > 1 || (photosetElement.length === 1 && hasClass(photosetElement[0], options.rowClass))) {
                        for (k = 0; k < photosetElement.length; k++) {
                            if (k === 0) {
                                var generatePhotosetContainer = document.createElement("div"); generatePhotosetContainer.className = options.generatedPhotosetContainerClass; photosetElement[k].parentNode.insertBefore(generatePhotosetContainer, photosetElement[k]); generatePhotosetContainer.appendChild(photosetElement[k]);
                            } else { photosetElement[k].previousSibling.appendChild(photosetElement[k]); }
                        }
                    }
                }
            }
        
            /* styling */
            var photosets = postCollection[i].querySelectorAll("." + options.generatedPhotosetContainerClass);
            for (j = 0; j < photosets.length; j++) {
                /* row-specific styling */
                var currentPhotosetRows = photosets[j].children;
                for (k = 0; k < currentPhotosetRows.length; k++) {
                    /* row margin */
                    if (k < currentPhotosetRows.length - 1) { currentPhotosetRows[k].style.marginBottom = usedMargin + usedUnit; }
                    /* image class */
                    for (l = 0; l < currentPhotosetRows[k].getElementsByTagName("img").length; l++) { currentPhotosetRows[k].getElementsByTagName("img")[l].className += " " + options.imageClass; }
                    /* style row with more than one image */
                    if (hasClass(currentPhotosetRows[k], options.rowClass)) {
                        /* style row images */
                        var currentRowImages = currentPhotosetRows[k].querySelectorAll("." + options.imageContainerClass);
                        for (l = 0; l < currentRowImages.length; l++) {
                            /* image container margin */
                            if (l < currentRowImages.length - 1) { currentRowImages[l].style.marginRight = usedMargin + usedUnit; }
                            /* image container width */
                            var amountOfImages = currentPhotosetRows[k].children.length;
                            if (defaultMargin === true) {
                                currentRowImages[l].style.width = ((100 - (usedMargin * (amountOfImages - 1))) / amountOfImages) + usedUnit;
                            } else {
                                currentRowImages[l].style.width = ((currentPhotosetRows[k].clientWidth - (usedMargin * (amountOfImages - 1))) / amountOfImages) + "px";
                            }
                            /* insertion of gallery indicators */
                            if (options.insertGalleryIndicator) {
                                var generateGalleryIndicator = document.createElement("div");
                                generateGalleryIndicator.className = options.galleryIndicatorClass;
                                generateGalleryIndicator.innerHTML = options.galleryIndicatorContent;
                                currentRowImages[l].appendChild(generateGalleryIndicator);
                            }
                        }
                    }
                }
                if (defaultMargin === true) { photosets[j].className += " adaptable_" + options.generatedPhotosetContainerClass; }
            }
        }
    
        /* function for row styling dependent on wrapper width */
        function styleRow() {
            var photosetRows = document.getElementsByClassName(options.rowClass);
            for (j = 0; j < photosetRows.length; j++) {
                /* image container width */
                var currentRowImageContainers = [];
                for (l = 0; l < photosetRows[j].childNodes.length; l++) {
                    if (new RegExp(options.imageContainerClass).test(photosetRows[j].childNodes[l].className) === true || new RegExp(options.imageContainerClass).test(photosetRows[j].childNodes[l].childNodes[0].className) === true) { currentRowImageContainers.push(photosetRows[j].childNodes[l]); }
                }
                var rowSize = (parseFloat(window.getComputedStyle(photosetRows[j]).width, 10) - (options.photosetMargins * (currentRowImageContainers.length - 1))) / currentRowImageContainers.length;
                for (l = 0; l < currentRowImageContainers.length; l++) {
                    if (!hasClass(photosetRows[j].parentNode, "adaptable_" + options.generatedPhotosetContainerClass)) { currentRowImageContainers[l].style.width = rowSize + "px"; }
                    photosetRows[j].setAttribute("data-row-size", rowSize);
                }
                
                /* image container height */
                var currentRowImages = photosetRows[j].querySelectorAll("." + options.imageClass);
                var currentRowImagesHeight = [];
                for (l = 0; l < currentRowImages.length; l++) {
                    if (currentRowImages[l].getAttribute("width") == false || currentRowImages[l].getAttribute("width") == null || currentRowImages[l].getAttribute("height") == false || currentRowImages[l].getAttribute("height") == null) { var imgWidth = currentRowImages[l].getAttribute("data-orig-width"); var imgHeight = currentRowImages[l].getAttribute("data-orig-height"); } else { var imgWidth = currentRowImages[l].getAttribute("width"); var imgHeight = currentRowImages[l].getAttribute("height"); }
                    var imageHeight = photosetRows[j].getAttribute("data-row-size") * (imgHeight / imgWidth);
                    currentRowImages[l].setAttribute("data-image-size", imageHeight);
                    currentRowImagesHeight.push(imageHeight);
                }
                var rowHeight = Math.min.apply(null, currentRowImagesHeight);
                var currentRowImages = photosetRows[j].querySelectorAll("." + options.imageContainerClass);
                for (l = 0; l < currentRowImages.length; l++) {
                    currentRowImages[l].style.height = rowHeight + parseInt(window.getComputedStyle(currentRowImages[l]).getPropertyValue("border-top-width"), 10) + parseInt(window.getComputedStyle(currentRowImages[l]).getPropertyValue("border-bottom-width"), 10) + "px";
                    var actualImage = currentRowImages[l].getElementsByClassName(options.imageClass)[0];
                    actualImage.style.marginTop = "-" + ((actualImage.getAttribute("data-image-size") - rowHeight) / 2) + "px";
                }
            }
        }
        
        /* create image collection */
        
        var imageCollection = [];
        for (i = 0; i < postCollection.length; i++) {
            var images = postCollection[i].querySelectorAll("." + options.generatedPhotosetContainerClass + " ." + options.imageClass);
            for (j = 0; j < images.length; j++) { imageCollection.push(images[j]); }
        }
        
        /* attach load and resize function for rows */
    
        if (rowFunctionAttached === false) {
            window.addEventListener("load", styleRow, false);
            window.addEventListener("resize", styleRow, false);
            rowFunctionAttached = true;
        } else {
            var loadCheck = 0;
        function hasLoaded(list) { loadCheck++; if (loadCheck === list.length) { styleRow(); } }
            for (i = 0; i < imageCollection.length; i++) { imageCollection[i].onload = function() { hasLoaded(imageCollection); } }
        }
        
        /* attach lightbox function */
        
        if (options.useTumblrLightbox === true) {
            function removeDefaultLightbox() {
                var imagesWithDefaultLightbox = document.querySelectorAll("." + options.rowClass + " ." + options.imageContainerClass + "[data-enable-lightbox]");
                for (i = 0; i < imagesWithDefaultLightbox.length; i++) { imagesWithDefaultLightbox[i].removeAttribute("data-enable-lightbox"); }
            }
            window.addEventListener("DOMContentLoaded", removeDefaultLightbox, false);
            
            function addLightbox() {
                if (event.type === "click" || (event.type === "keypress" && (event.key === "Enter" || event.which === 13))) {
                    var photo = this.querySelector("img");
                    photosetData = [];
                    
                    function addData(photo) {
                        if (!photo.getAttribute("data-highres")) {
                            var orgSrc = photo.src.slice(0, photo.src.lastIndexOf("."));
                            if (orgSrc.lastIndexOf("_") !== -1) {
                                orgSrc = orgSrc.slice(0, (orgSrc.lastIndexOf("_") + 1));
                                var imgFormat = photo.src.slice(photo.src.lastIndexOf("."));
                                highres = orgSrc + 1280 + imgFormat;
                            } else { highres = photo.src; }
                            photo.setAttribute("data-highres", highres);
                        }
                        
                        photosetData.push({ 
                            "width": photo.getAttribute("data-orig-width"),
                            "height": photo.getAttribute("data-orig-height"),
                            "low_res": photo.src,
                            "high_res": photo.getAttribute("data-highres")
                        });
                    }
                    
                    var photoIndex = this.getAttribute("data-count");
                    for (el = this; el.className.indexOf(options.generatedPhotosetContainerClass) < 0; ) { el = el.parentNode; }
                    var photos = el.querySelectorAll("." + options.imageClass);
                    for (k = 0; k < photos.length; k++) { addData(photos[k]); }
                    Tumblr.Lightbox.init(photosetData, photoIndex);
                }
            }
            
            for (i = 0; i < imageCollection.length; i++) {
                for (element = imageCollection[i]; element.className.indexOf(options.generatedPhotosetContainerClass) < 0; ) { element = element.parentNode; }
                var currentPhotosetPhotos = element.querySelectorAll("." + options.imageContainerClass);
                for (j = 0; j < currentPhotosetPhotos.length; j++) {
                    currentPhotosetPhotos[j].setAttribute("tabindex", "0");
                    currentPhotosetPhotos[j].setAttribute("data-count", (j + 1));
                    currentPhotosetPhotos[j].addEventListener("click", addLightbox, false);
                    currentPhotosetPhotos[j].addEventListener("keypress", addLightbox, false);
                }
                i += (currentPhotosetPhotos.length - 1);
            }
        }
    } else {
        console.log('[NPF PHOTOSETS] please enter a valid custom margin value or empty "photosetMargins".');
    }
}
